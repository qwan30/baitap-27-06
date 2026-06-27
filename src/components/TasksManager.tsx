import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ListTodo,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  User,
  Calendar,
  ArrowRight,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Meeting, ActionItem } from '../types';

interface TasksManagerProps {
  meetings: Meeting[];
  onToggleActionItem: (meetingId: string, actionId: string, currentStatus: 'pending' | 'completed') => Promise<void>;
  onOpenMeetingDetail: (meeting: Meeting) => void;
}

export const TasksManager: React.FC<TasksManagerProps> = ({
  meetings,
  onToggleActionItem,
  onOpenMeetingDetail
}) => {
  const [taskSearch, setTaskSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const today = new Date('2026-06-22'); // Align with our ADDITIONAL_METADATA context date

  // Extract all tasks with their parent meeting details attached!
  interface TaskWithMeeting extends ActionItem {
    meetingId: string;
    meetingTitle: string;
    meetingType: string;
    parentMeeting: Meeting;
  }

  const allTasks: TaskWithMeeting[] = [];

  meetings.forEach(m => {
    if (m.actionItems) {
      m.actionItems.forEach(t => {
        allTasks.push({
          ...t,
          meetingId: m.id,
          meetingTitle: m.title,
          meetingType: m.type,
          parentMeeting: m
        });
      });
    }
  });

  // Calculate stats for top ribbons
  const totalCount = allTasks.length;
  const pendingCount = allTasks.filter(t => t.status === 'pending').length;
  const completedCount = allTasks.filter(t => t.status === 'completed').length;
  
  const overdueCount = allTasks.filter(t => {
    if (t.status === 'completed') return false;
    const due = new Date(t.dueDate);
    return due < today;
  }).length;

  const urgentCount = allTasks.filter(t => t.status === 'pending' && (t.priority === 'urgent' || t.priority === 'high')).length;

  // Perform search and filter
  const filteredTasks = allTasks.filter(t => {
    // 1. Keyword search (Title, assignee, description, meeting title)
    const q = taskSearch.toLowerCase();
    const matchesKeyword = 
      t.title.toLowerCase().includes(q) ||
      (t.assignee && t.assignee.toLowerCase().includes(q)) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      t.meetingTitle.toLowerCase().includes(q);

    if (!matchesKeyword) return false;

    // 2. Status filter
    if (statusFilter === 'pending') {
      if (t.status !== 'pending') return false;
    } else if (statusFilter === 'completed') {
      if (t.status !== 'completed') return false;
    } else if (statusFilter === 'overdue') {
      if (t.status === 'completed') return false;
      const due = new Date(t.dueDate);
      if (due >= today) return false;
    }

    // 3. Priority filter
    if (priorityFilter !== 'all') {
      const p = t.priority || 'medium';
      if (p.toLowerCase() !== priorityFilter.toLowerCase()) return false;
    }

    return true;
  });

  // Handle click on action item checkbox
  const handleCheckboxClick = async (task: TaskWithMeeting) => {
    setTogglingId(task.id);
    try {
      await onToggleActionItem(task.meetingId, task.id, task.status);
    } catch (e) {
      console.error("Failed to toggle task", e);
    } finally {
      setTogglingId(null);
    }
  };

  // Date formatter helper
  const formatDueDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const isPast = d < today;
      const formatted = d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      return { formatted, isPast };
    } catch {
      return { formatted: dateStr, isPast: false };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Title ribbon */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-[#111111] font-sans flex items-center gap-2">
          <ListTodo className="w-6 h-6 text-blue-600" />
          <span>Action Items Center</span>
        </h2>
        <p className="text-xs text-gray-500">
          Review, search, filter, and check off outstanding goals extracted across your entire discussion registry.
        </p>
      </div>

      {/* KPI Stats sub-ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1 font-sans">
        {[
          { label: 'Pending items', val: pendingCount, desc: `${overdueCount} items overdue`, highlight: overdueCount > 0 ? 'text-red-600' : 'text-gray-400' },
          { label: 'Done Checklists', val: completedCount, desc: `Success rate: ${totalCount > 0 ? Math.round((completedCount/totalCount)*100) : 100}%`, highlight: 'text-emerald-500' },
          { label: 'Overdue alarms', val: overdueCount, desc: 'Requires immediate sync', highlight: overdueCount > 0 ? 'text-red-500 font-bold' : 'text-gray-400' },
          { label: 'Urgent priority', val: urgentCount, desc: 'Flagged high priority', highlight: urgentCount > 0 ? 'text-amber-500' : 'text-gray-400' }
        ].map((met, i) => (
          <div key={i} className="bg-white p-4 rounded-lg border border-[#e5e7eb] flex flex-col justify-between shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{met.label}</span>
            <span className="text-2xl font-extrabold text-[#111111] font-sans my-1">{met.val}</span>
            <span className={`text-[10px] font-medium leading-none ${met.highlight}`}>{met.desc}</span>
          </div>
        ))}
      </div>

      {/* Filters & Configuration Row */}
      <div className="flex flex-col md:flex-row gap-3 items-center bg-gray-50 p-4 border border-[#e5e7eb] rounded-xl font-sans">
        
        {/* Keyword Search */}
        <div className="w-full md:flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={taskSearch}
            onChange={e => setTaskSearch(e.target.value)}
            placeholder="Search action keyword, assignee name, or meeting source..."
            className="w-full bg-white border border-[#e5e7eb] rounded-md pl-9 pr-4 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] transition placeholder-gray-400"
          />
          {taskSearch && (
            <button 
              onClick={() => setTaskSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Filters buttons */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none shrink-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition ${
              statusFilter === 'all' 
                ? 'bg-[#111111] text-white shadow-sm' 
                : 'bg-white text-gray-500 hover:text-[#111111] hover:bg-gray-100 border border-gray-200'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition ${
              statusFilter === 'pending' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'bg-white text-gray-500 hover:text-[#111111] hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition ${
              statusFilter === 'completed' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'bg-white text-gray-500 hover:text-[#111111] hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Done ({completedCount})
          </button>
          <button
            onClick={() => setStatusFilter('overdue')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition ${
              statusFilter === 'overdue' 
                ? 'bg-red-600 text-white shadow-sm' 
                : 'bg-white text-gray-500 hover:text-[#111111] hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Overdue ({overdueCount})
          </button>
        </div>

        {/* Priority Filter custom select */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Priority:</span>
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="bg-white border border-[#e5e7eb] rounded-md px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-[#111111] transition w-full md:w-28"
          >
            <option value="all">All levels</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

      </div>

      {/* Main Task List Grid */}
      <div className="space-y-3 font-sans">
        {filteredTasks.length === 0 ? (
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-16 text-center max-w-md mx-auto space-y-3">
            <ListTodo className="w-8 h-8 text-gray-300 mx-auto" />
            <h4 className="text-[13px] font-semibold text-[#111111]">No Matching Tasks Found</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed max-w-xs mx-auto">
              Try adjusting your search criteria, clearing active filters, or record a session with action items.
            </p>
            {(taskSearch || statusFilter !== 'all' || priorityFilter !== 'all') && (
              <button
                onClick={() => {
                  setTaskSearch('');
                  setStatusFilter('all');
                  setPriorityFilter('all');
                }}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                Clear all active filters
              </button>
            )}
          </div>
        ) : (
          filteredTasks.map((task) => {
            const { formatted, isPast } = formatDueDate(task.dueDate);
            const isCompleted = task.status === 'completed';
            const isUrgent = task.priority === 'urgent' || task.priority === 'high';
            
            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white border p-4.5 rounded-lg flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-4 transition-all hover:border-[#111111] ${
                  isCompleted 
                    ? 'border-gray-250 bg-gray-50/50' 
                    : isPast 
                      ? 'border-red-150 bg-red-50/5' 
                      : 'border-[#e5e7eb]'
                }`}
              >
                {/* Checkbox + Title section */}
                <div className="flex items-start gap-3 w-full sm:max-w-2xl text-left">
                  <button
                    onClick={() => handleCheckboxClick(task)}
                    disabled={togglingId === task.id}
                    className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition shrink-0 ${
                      isCompleted 
                        ? 'bg-emerald-500 border-emerald-600 text-white' 
                        : togglingId === task.id
                          ? 'bg-blue-50 border-blue-200 animate-pulse'
                          : isPast 
                            ? 'border-red-300 hover:border-red-500 hover:bg-red-50/20' 
                            : 'border-gray-300 hover:border-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-white stroke-[3px]" />}
                  </button>

                  <div className="flex-1 space-y-1.5 overflow-hidden">
                    <span 
                      className={`text-xs font-semibold block leading-snug break-words ${
                        isCompleted ? 'text-gray-400 line-through font-normal' : 'text-[#111111]'
                      }`}
                    >
                      {task.title}
                    </span>

                    {/* Metadata tags line */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-gray-400">
                      
                      {/* Priority pill */}
                      {task.priority && (
                        <span className={`px-1.5 py-0.2 rounded font-bold uppercase tracking-wide text-[9px] ${
                          task.priority === 'urgent'
                            ? 'bg-red-100 text-red-700'
                            : task.priority === 'high'
                              ? 'bg-amber-100 text-amber-700'
                              : task.priority === 'medium'
                                ? 'bg-blue-50 text-blue-600'
                                : 'bg-gray-100 text-gray-600'
                        }`}>
                          {task.priority}
                        </span>
                      )}

                      {/* Assignee item */}
                      <span className="flex items-center gap-0.5 text-gray-500 font-medium">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span>{task.assignee || 'Unassigned'}</span>
                      </span>

                      <span className="text-gray-300">•</span>

                      {/* Due Date capsule */}
                      <span className={`inline-flex items-center gap-0.5 ${
                        !isCompleted && isPast 
                          ? 'text-red-500 font-bold' 
                          : 'text-gray-400 font-medium'
                      }`}>
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span>Due {formatted}</span>
                        {!isCompleted && isPast && (
                          <span className="ml-1 text-[8.5px] uppercase bg-red-50 text-red-600 border border-red-200 px-1 rounded animate-pulse">Overdue</span>
                        )}
                      </span>

                      <span className="text-gray-300 hidden md:inline">•</span>

                      {/* Parent Meeting Link */}
                      <span 
                        onClick={() => onOpenMeetingDetail(task.parentMeeting)}
                        className="hidden md:inline-flex items-center gap-0.5 text-blue-600 hover:underline cursor-pointer group font-medium"
                      >
                        <span>From: {task.meetingTitle}</span>
                        <ArrowUpRight className="w-3 h-3 text-blue-400 group-hover:text-blue-600 transition" />
                      </span>

                    </div>
                  </div>
                </div>

                {/* Mobile visible Deep Link button */}
                <div className="flex sm:self-center shrink-0 w-full sm:w-auto pt-1 sm:pt-0 border-t sm:border-0 border-gray-100 gap-1.5">
                  <button
                    onClick={() => onOpenMeetingDetail(task.parentMeeting)}
                    className="w-full sm:w-auto px-3 py-1 bg-[#f5f5f5] hover:bg-gray-150 text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded text-[10.5px] font-semibold transition flex items-center justify-center gap-1 shrink-0"
                  >
                    <span>View Session</span>
                    <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-gray-700" />
                  </button>
                </div>

              </motion.div>
            );
          })
        )}
      </div>

    </div>
  );
};
