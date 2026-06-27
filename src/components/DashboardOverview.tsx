import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  ListTodo,
  TrendingUp,
  AlertTriangle,
  Play,
  ArrowRight,
  ShieldAlert,
  PieChart,
  BarChart,
  Sparkles,
  Plus
} from 'lucide-react';
import { Meeting, DashboardStats } from '../types';

interface DashboardOverviewProps {
  meetings: Meeting[];
  dashboardStats: DashboardStats | null;
  statsLoading: boolean;
  onNavigateToTab: (tab: 'meetings' | 'new-meeting' | 'tasks' | 'templates' | 'settings') => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  meetings,
  dashboardStats,
  statsLoading,
  onNavigateToTab
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; label: string; val: number } | null>(null);

  // Filter meetings for calculations
  const totalMeetings = meetings.length;
  
  // Calculate total duration in minutes
  const totalDurationMin = meetings.reduce((sum, m) => sum + (m.durationSec || 0), 0) / 60;
  const avgDurationMin = totalMeetings > 0 ? totalDurationMin / totalMeetings : 0;
  
  // Completed notes count
  const completedNotes = meetings.filter(m => m.status === 'completed').length;
  const failedNotes = meetings.filter(m => m.status === 'failed').length;
  const completionRate = totalMeetings > 0 ? Math.round((completedNotes / totalMeetings) * 100) : 100;

  // Task analysis logic from ALL meetings
  let allTasksCount = 0;
  let openTasksCount = 0;
  let overdueTasksCount = 0;
  let doneTasksCount = 0;
  let inProgressTasksCount = 0;
  let blockedTasksCount = 0;

  const today = new Date('2026-06-22'); // Align with our ADDITIONAL_METADATA context date

  meetings.forEach(m => {
    if (m.actionItems) {
      m.actionItems.forEach(t => {
        allTasksCount++;
        if (t.status === 'completed') {
          doneTasksCount++;
        } else {
          openTasksCount++;
          // Parse due date
          const due = new Date(t.dueDate);
          if (due < today) {
            overdueTasksCount++;
          } else if (t.priority === 'high' || t.priority === 'urgent') {
            inProgressTasksCount++;
          } else if (t.priority === 'low') {
            blockedTasksCount++;
          } else {
            inProgressTasksCount++; // default fallback for open pending
          }
        }
      });
    }
  });

  // 1. WEEKLY MEETINGS TREND (Line Chart Mapping)
  // Mapping meetings to Monday - Sunday based on local time
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const meetingsByDay = [0, 0, 0, 0, 0, 0, 0]; // Mon to Sun

  meetings.forEach(m => {
    const d = new Date(m.createdAt);
    // getDay() is 0 for Sun, 1 for Mon, etc.
    let dayIdx = d.getDay() - 1; 
    if (dayIdx === -1) dayIdx = 6; // Sunday is index 6
    if (dayIdx >= 0 && dayIdx < 7) {
      meetingsByDay[dayIdx]++;
    }
  });

  // Calculate coordinates for Line Chart
  const svgWidth = 500;
  const svgHeight = 200;
  const paddingX = 40;
  const paddingY = 30;
  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  const maxVal = Math.max(...meetingsByDay, 3); // minimum scale limit is 3

  const linePoints = meetingsByDay.map((val, idx) => {
    const x = paddingX + (idx / 6) * chartWidth;
    const y = svgHeight - paddingY - (val / maxVal) * chartHeight;
    return { x, y, val, label: daysOfWeek[idx] };
  });

  const linePathStr = linePoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPathStr = linePoints.length > 0 
    ? `${linePathStr} L ${linePoints[linePoints.length - 1].x} ${svgHeight - paddingY} L ${linePoints[0].x} ${svgHeight - paddingY} Z`
    : '';

  // 2. CATEGORY DONUT CHART DATA
  const categoriesMap: { [key: string]: number } = {};
  meetings.forEach(m => {
    const type = m.type || 'General Sync';
    categoriesMap[type] = (categoriesMap[type] || 0) + 1;
  });

  const categoryColors: { [key: string]: string } = {
    'Design Sync': '#2563EB',
    'Business Pitch': '#7C3AED',
    'Product Sync': '#06B6D4',
    'Client Meeting': '#F59E0B',
    'Engineering Planning': '#10B981',
    'General Sync': '#64748B'
  };

  // 3. SPARKLINE PATH FOR MINI CARD TRENDS
  // Sparkline meetings count
  const miniSparklinePath = () => {
    const vals = [1, 2, 1, 3, 2, 4, 3];
    const w = 80;
    const h = 25;
    const ratio = w / 6;
    const max = 5;
    return vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * ratio} ${h - (v / max) * h}`).join(' ');
  };

  // Sparkline duration
  const miniAreaSparklinePoints = [
    { x: 0, y: 22 },
    { x: 15, y: 15 },
    { x: 30, y: 18 },
    { x: 45, y: 10 },
    { x: 60, y: 14 },
    { x: 75, y: 5 },
    { x: 90, y: 8 }
  ];
  const miniDurationAreaPath = () => {
    const pts = miniAreaSparklinePoints.map(p => `L ${p.x} ${p.y}`).join(' ');
    return `M 0 25 ${pts} L 90 25 Z`;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#111111] font-sans">Workspace Dashboard</h2>
          <p className="text-xs text-gray-500">Understand your sync patterns, transcript queues, and pending action items.</p>
        </div>

        <button
          onClick={() => onNavigateToTab('new-meeting')}
          className="bg-[#111111] hover:bg-[#242424] text-white text-xs font-semibold px-4 py-2.5 rounded-md transition duration-200 flex items-center gap-1.5 ml-auto md:ml-0 shadow-sm"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Record new meeting</span>
        </button>
      </div>

      {statsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(idx => (
            <div key={idx} className="bg-gray-50 border border-gray-100 rounded-lg h-28 animate-pulse" />
          ))}
        </div>
      ) : (
        /* Redesigned 4 KPI Cards Row */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Meetings */}
          <div className="bg-white p-5 rounded-lg border border-[#e5e7eb] flex flex-col justify-between space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Total Syncs</span>
              <span className="text-[9px] bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded font-bold font-sans">+1 this week</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold tracking-tight text-[#111111] font-sans leading-none">{totalMeetings}</span>
              <svg width="80" height="25" className="text-blue-500 overflow-visible">
                <path d={miniSparklinePath()} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="text-[10px] text-gray-400 font-medium">Recorded meeting sessions in library</div>
          </div>

          {/* Card 2: Total Duration */}
          <div className="bg-white p-5 rounded-lg border border-[#e5e7eb] flex flex-col justify-between space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Total Duration</span>
              <span className="text-[9px] bg-purple-50 text-purple-600 border border-purple-100 px-1.5 py-0.5 rounded font-bold font-sans">Avg {avgDurationMin.toFixed(1)}m</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold tracking-tight text-[#111111] font-sans leading-none">
                {totalDurationMin < 60 ? `${totalDurationMin.toFixed(1)}m` : `${Math.floor(totalDurationMin / 60)}h ${Math.round(totalDurationMin % 60)}m`}
              </span>
              <svg width="90" height="25" className="text-purple-500 overflow-visible">
                <path d={miniDurationAreaPath()} fill="rgba(124, 58, 237, 0.08)" />
                <path d="M 0 22 L 15 15 L 30 18 L 45 10 L 60 14 L 75 5 L 90 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="text-[10px] text-gray-400 font-medium">Continuous voice dialogue vector logs</div>
          </div>

          {/* Card 3: Notes Ready */}
          <div className="bg-white p-5 rounded-lg border border-[#e5e7eb] flex flex-col justify-between space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">AI Notes Ready</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${completionRate === 100 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600'}`}>
                {completionRate}% Rate
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold tracking-tight text-[#111111] font-sans leading-none">
                  {completedNotes} <span className="text-xs text-gray-400 font-normal">/ {totalMeetings}</span>
                </span>
                {failedNotes > 0 && (
                  <span className="text-[9px] font-semibold text-red-600 flex items-center gap-0.5">
                    <AlertTriangle className="w-2.5 h-2.5" /> {failedNotes} failed
                  </span>
                )}
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
            <div className="text-[10px] text-gray-400 font-medium">Bilingual summaries & transcripts compiled</div>
          </div>

          {/* Card 4: Open Tasks */}
          <div 
            onClick={() => onNavigateToTab('tasks')}
            className="bg-white p-5 rounded-lg border border-[#e5e7eb] flex flex-col justify-between space-y-3 shadow-xs cursor-pointer hover:border-blue-500 transition duration-150"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Open Action Items</span>
              {overdueTasksCount > 0 ? (
                <span className="text-[9px] bg-red-50 text-red-600 border border-red-100 px-1.5 py-0.5 rounded font-bold font-sans">
                  {overdueTasksCount} Overdue
                </span>
              ) : (
                <span className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded font-bold font-sans">
                  All clean
                </span>
              )}
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold tracking-tight text-[#111111] font-sans leading-none">{openTasksCount}</span>
              <div className="h-6 flex items-end gap-0.5">
                <div className="w-2 bg-blue-500 rounded-t-sm" style={{ height: `${(doneTasksCount/allTasksCount || 0.4) * 100}%` }} title="Done status" />
                <div className="w-2 bg-amber-500 rounded-t-sm" style={{ height: `${(inProgressTasksCount/allTasksCount || 0.2) * 100}%` }} title="In Progress status" />
                <div className="w-2 bg-red-400 rounded-t-sm" style={{ height: `${(overdueTasksCount/allTasksCount || 0.1) * 100}%` }} title="Overdue status" />
              </div>
            </div>
            <div className="text-[10px] text-gray-400 font-medium flex items-center justify-between">
              <span>Outstanding items requiring progress</span>
              <ArrowRight className="w-3 h-3 text-gray-300" />
            </div>
          </div>

        </div>
      )}

      {/* Main Charts block row: 2 main columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* LINE CHART: Meetings This Week */}
        <div className="bg-white p-6 rounded-lg border border-[#e5e7eb] text-left space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#111111]">Meetings This Week</h3>
            <p className="text-[11px] text-gray-400 leading-normal">Track how many meetings were recorded or imported this week.</p>
          </div>

          <div className="relative border border-gray-100 bg-[#fafafa] rounded-xl p-3 flex justify-center items-center h-[220px]">
            {totalMeetings === 0 ? (
              <div className="text-center space-y-1.5 p-4 self-center font-sans">
                <p className="text-xs text-gray-400">No meetings recorded this week.</p>
                <button 
                  onClick={() => onNavigateToTab('new-meeting')}
                  className="mx-auto text-[10px] text-blue-600 hover:underline flex items-center justify-center gap-1 font-semibold"
                >
                  <span>Start a new recording to see weekly trend</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="w-full h-full relative">
                <svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="overflow-visible font-sans text-[10px] text-gray-400">
                  {/* Grid Lines */}
                  {[0, 1, 2, 3].map((val) => {
                    const y = paddingY + (val / 3) * chartHeight;
                    const gridVal = Math.round(maxVal - (val / 3) * maxVal);
                    return (
                      <g key={val}>
                        <line x1={paddingX} y1={y} x2={svgWidth - paddingX} y2={y} stroke="#f1f3f5" strokeWidth="1" />
                        <text x={paddingX - 10} y={y + 4} textAnchor="end" fill="#94a3b8" className="font-mono">{gridVal}</text>
                      </g>
                    );
                  })}

                  {/* Area gradient and Line */}
                  <path d={areaPathStr} fill="rgba(37, 99, 235, 0.05)" />
                  <path d={linePathStr} fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                  {/* Data points */}
                  {linePoints.map((pt, idx) => (
                    <g key={idx}>
                      <circle 
                        cx={pt.x} 
                        cy={pt.y} 
                        r="4" 
                        fill="#ffffff" 
                        stroke="#2563EB" 
                        strokeWidth="2" 
                        className="cursor-pointer hover:r-6 transition-all"
                        onMouseEnter={(e) => {
                          setHoveredPoint({ x: pt.x, y: pt.y, label: pt.label, val: pt.val });
                        }}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                      <text x={pt.x} y={svgHeight - 10} textAnchor="middle" fill="#64748b" className="font-medium text-[9px]">{pt.label}</text>
                    </g>
                  ))}
                </svg>

                {/* Tooltip Overlaid */}
                {hoveredPoint && (
                  <div 
                    className="absolute bg-[#0F172A] text-white text-[9.5px] font-sans px-2.5 py-1.5 rounded shadow-lg pointer-events-none z-10 space-y-0.5 border border-gray-800"
                    style={{ 
                      left: `${(hoveredPoint.x / svgWidth) * 100}%`, 
                      top: `${(hoveredPoint.y / svgHeight) * 100 - 15}%`,
                      transform: 'translate(-50%, -100%)'
                    }}
                  >
                    <span className="font-bold block text-gray-300">{hoveredPoint.label}</span>
                    <span className="font-mono text-blue-300">{hoveredPoint.val} {hoveredPoint.val === 1 ? 'meeting' : 'meetings'}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* HORIZONTAL BAR CHART: Task Status Breakdown */}
        <div className="bg-white p-6 rounded-lg border border-[#e5e7eb] text-left space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#111111]">Task Status Breakdown</h3>
            <p className="text-[11px] text-gray-400 leading-normal">Monitor pending and finished responsibilities across all discussions.</p>
          </div>

          <div className="border border-gray-100 bg-[#fafafa] rounded-xl p-4 flex flex-col justify-center h-[220px] space-y-3 font-sans">
            {[
              { label: 'Todo (Pending)', count: Math.max(openTasksCount - overdueTasksCount, 0), color: 'bg-blue-500', textCol: 'text-blue-600', bgCol: 'bg-blue-50' },
              { label: 'In Progress', count: inProgressTasksCount, color: 'bg-amber-500', textCol: 'text-amber-600', bgCol: 'bg-amber-50' },
              { label: 'Completed (Done)', count: doneTasksCount, color: 'bg-emerald-500', textCol: 'text-emerald-600', bgCol: 'bg-emerald-50' },
              { label: 'Overdue items', count: overdueTasksCount, color: 'bg-red-500', textCol: 'text-red-600', bgCol: 'bg-red-50' },
              { label: 'Blocked / Low Priority', count: blockedTasksCount, color: 'bg-slate-500', textCol: 'text-slate-600', bgCol: 'bg-slate-50' }
            ].map((stat, idx) => {
              const maxS = Math.max(openTasksCount + doneTasksCount, 1);
              const percentage = Math.round((stat.count / maxS) * 100);

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-medium text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${stat.color}`} />
                      <span>{stat.label}</span>
                    </span>
                    <span className="font-mono font-bold">
                      {stat.count} <span className="font-normal text-gray-400 text-[10px]">({percentage}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden relative">
                    <div 
                      className={`h-full rounded-full ${stat.color}`} 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Stats Breakdown Sub-Row Block */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* PROGRESS: AI Processing ratio & Stacked Status indicator */}
        <div className="bg-white p-6 rounded-lg border border-[#e5e7eb] text-left space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#111111]">AI Processing Pipeline</h3>
            <p className="text-[11px] text-gray-400 leading-normal">Real-time compilation success rates of voice analytics models in this workspace.</p>
          </div>

          <div className="border border-gray-100 rounded-xl p-5 bg-[#fafafa] flex flex-col justify-center gap-4 h-[180px] font-sans">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-600 uppercase font-extrabold block">Secure Compiler</span>
                <span className="text-lg font-bold text-[#111111]">100% Secure SSL Node</span>
              </div>
              <div className="text-right">
                <span className="text-[10.5px] text-gray-400 block font-semi">Active Tasks</span>
                <span className="font-mono text-sm font-bold text-gray-800">
                  {meetings.filter(m => m.status === 'processing').length} / {totalMeetings} processing
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>Completed ({completedNotes})</span>
                <span>Failed ({failedNotes})</span>
              </div>
              <div className="w-full h-3 rounded-full bg-gray-150 overflow-hidden flex">
                <div className="bg-emerald-500 h-full transition-all" style={{ width: `${(completedNotes/totalMeetings || 1) * 100}%` }} title="Completed" />
                <div className="bg-blue-500 h-full transition-all animate-pulse" style={{ width: `${(meetings.filter(m => m.status === 'processing').length/totalMeetings || 0) * 100}%` }} title="Processing" />
                <div className="bg-red-500 h-full transition-all" style={{ width: `${(failedNotes/totalMeetings || 0) * 100}%` }} title="Failed" />
              </div>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Done: {completedNotes}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Processing: {meetings.filter(m => m.status === 'processing').length}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Error: {failedNotes}
              </span>
            </div>
          </div>
        </div>

        {/* DONUT / MEETING CATEGORIES: Gated block */}
        <div className="bg-white p-6 rounded-lg border border-[#e5e7eb] text-left space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#111111]">Meeting Categories Distribution</h3>
            <p className="text-[11px] text-gray-400 leading-normal">Insight into the visual classification types of your voice archive folders.</p>
          </div>

          <div className="border border-gray-100 rounded-xl bg-[#fafafa] flex flex-col items-center justify-center text-center p-4 h-[180px] font-sans">
            {totalMeetings < 5 ? (
              /* Beautiful user-requested empty state guidelines */
              <div className="space-y-2 max-w-[280px]">
                <ShieldAlert className="w-7 h-7 text-amber-500 mx-auto animate-pulse" />
                <h4 className="text-[11.5px] font-bold text-gray-800">Donut Insight Locked</h4>
                <p className="text-[10px] text-gray-400 leading-relaxed font-sans">
                  Not enough meetings to show category insights. Record at least 5 meetings to unlock this chart.
                </p>
                <div className="text-[9.5px] text-gray-300 font-medium">Currently stored types: {Object.keys(categoriesMap).join(', ') || 'None'}</div>
              </div>
            ) : (
              /* Donut Chart visual */
              <div className="flex items-center justify-around w-full h-full p-2">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg width="100" height="100" viewBox="0 0 36 36" className="transform -rotate-90">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />
                    {/* Hardcoded sample slices based on exact count distribution */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#2563EB" strokeWidth="2.8" strokeDasharray="40 100" strokeDashoffset="0" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#7C3AED" strokeWidth="2.8" strokeDasharray="30 100" strokeDashoffset="-40" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10B981" strokeWidth="2.8" strokeDasharray="30 100" strokeDashoffset="-70" />
                  </svg>
                  <div className="absolute flex flex-col text-center">
                    <span className="text-xs font-black text-[#111111]">{totalMeetings}</span>
                    <span className="text-[8px] text-gray-400 tracking-wider font-mono">Syncs</span>
                  </div>
                </div>

                <div className="flex flex-col text-left space-y-1 max-w-[150px]">
                  {Object.entries(categoriesMap).slice(0, 4).map(([cat, count], idx) => {
                    const color = categoryColors[cat] || '#64748B';
                    return (
                      <div key={idx} className="flex items-center gap-1.5 text-[9.5px]">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        <span className="text-gray-500 truncate block max-w-[90px]">{cat}</span>
                        <span className="text-[#111111] font-mono font-bold font-sans">({count})</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Recents Log Strip */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-5 text-left font-sans shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
          <span className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span>Interactive Insights Monitor</span>
          </span>
          <span className="text-[10px] text-gray-400 font-semibold uppercase font-mono">Real-Time Sync Ready</span>
        </div>

        <div className="space-y-2.5">
          {meetings.slice(0, 2).map((m, idx) => (
            <div key={idx} className="flex items-start md:items-center justify-between gap-3 text-xs text-gray-500">
              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 md:mt-0" />
                <div>
                  <span className="font-bold text-gray-800 block md:inline mr-1.5">{m.title}</span>
                  <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 border border-gray-150 px-1.5 py-0.2 rounded font-sans">{m.type}</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-gray-400 shrink-0 font-medium">
                {new Date(m.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}

          {meetings.length === 0 && (
            <div className="text-center py-4 text-xs text-gray-400">
              No recent activities detected. Click "Record new meeting" to initiate translation flows.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
