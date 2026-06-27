import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  Copy,
  Check,
  Play,
  ArrowRight,
  Clock,
  Briefcase,
  Layers,
  HelpCircle,
  Sparkles,
  Award
} from 'lucide-react';

interface TemplateDef {
  id: string;
  title: string;
  category: string;
  durationFmt: string;
  description: string;
  agenda: string[];
  templateSnippet: string;
}

const TEMPLATE_PRESETS: TemplateDef[] = [
  {
    id: 'tpl_design_system',
    title: 'Design System & Accessibility Sync',
    category: 'Design Sync',
    durationFmt: '30 mins',
    description: 'Perfect for aligning developers and designers on color palettes, spacing metrics, glassmorphic effects, and WCAG accessibility contrast ratios.',
    agenda: [
      'Visual alignment on brand colors, gradients, and active button glow states.',
      'Accessibility review: Ensure neon cyan highlights pass WCAG contrast scores.',
      'Recording session safeguards: Discuss dynamic unload warning configurations.',
      'Documentation timeline: Markdown export formatting guidelines.'
    ],
    templateSnippet: `# Design System Alignment Setup\n\n## Discussion Scope\n- Brand identity integration\n- Translucent glassmorphic dark purple component highlights\n- WCAG visual contrast audit criteria\n\n## Targets\n- Neon border specification sheets\n- Unload warning beforeunload dynamic states\n- Export to high-fidelity Markdown diaries`
  },
  {
    id: 'tpl_business_pitch',
    title: 'Business Growth & Coffee Brand Pitch',
    category: 'Business Pitch',
    durationFmt: '45 mins',
    description: 'Designed for planning agricultural seed pitches, brand stories, packaging specs (biodegradable sugarcane zip guides), and slide presentations.',
    agenda: [
      'Storytelling: Di Linh local agricultural partnerships, sustainable Robusta bean supplies.',
      'Technical packaging: Biodegradable bag options, sugarcane organic paper zip bags.',
      'Schedules: Timeline for the first physical raw prototype review by next Tuesday.',
      'Distribution: Target pitch strategy to export to international partners.'
    ],
    templateSnippet: `# Brand Strategic Pitch Blueprint\n\n## Core Brand Narrative\n- Organic, clean, healthy Robusta bean supplies from local Di Linh growers\n- 100% ripe harvest fermentation guidelines\n\n## Logistics\n- Sugarcane eco bag packaging prototypes\n- Timeline for international bilingual presentation slides`
  },
  {
    id: 'tpl_agile_retro',
    title: 'Agile Retrospective & Task Assignment',
    category: 'Product Sync',
    durationFmt: '15 mins',
    description: 'Short and sweet standup format to review open action items, clear roadblocks, assign tasks, and verify developer execution velocities.',
    agenda: [
      'Roadblock alignment: What is currently blocking active features?',
      'Checklist review: Highlight finished and scheduled action items.',
      'Assignee workload: Equal distribution of system-wide tickets.',
      'Release target: Production compilation check steps.'
    ],
    templateSnippet: `# Weekly Sprint Retro Agenda\n\n## Standup Log\n- Achieved yesterday\n- Targets today\n- active blockers\n\n## Task Auditing\n- Action items assignment list\n- Strict priority tagging (Urgent / High / Medium / Low)`
  },
  {
    id: 'tpl_tech_review',
    title: 'Technical Architecture & Compliance Audit',
    category: 'General Sync',
    durationFmt: '60 mins',
    description: 'A deep review on microservices, file-system JSON database storage, data encryption standards, safety compliance audits, and local cache backups.',
    agenda: [
      'Database structures: Evaluate JSON file-system robustness, speed, or size caps.',
      'Privacy settings: Workspace compliance, logs retention, and session wipe triggers.',
      'Google Cloud integration: Container ingress rules and proxy SSL constraints.',
      'API architectures: REST versioning endpoints and exception handlers.'
    ],
    templateSnippet: `# Systems Architecture Outline\n\n## Backend Infrastructure\n- JSON meetings-db cloud persistence synchronization\n- CORS, API headers, and SSL certificates\n\n## Data Sanitation\n- Automatic session clear-out routines\n- Auditable security logs compliance certificates`
  }
];

interface MeetingTemplatesProps {
  onSelectTemplate: (title: string, desc: string, type: string) => void;
}

export const MeetingTemplates: React.FC<MeetingTemplatesProps> = ({ onSelectTemplate }) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(TEMPLATE_PRESETS[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selectedTemplate = TEMPLATE_PRESETS.find(t => t.id === selectedPresetId) || TEMPLATE_PRESETS[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-[#111111] font-sans flex items-center gap-2">
          <FileText className="w-6 h-6 text-purple-600" />
          <span>Sync Blueprint Blueprints</span>
        </h2>
        <p className="text-xs text-gray-500">
          Preconfigured corporate structures, copyable agendas, and meeting outlines to speed up transcription accuracy.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-1 font-sans">
        
        {/* Left column: Template cards list */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1">Select Blueprint</span>
          
          {TEMPLATE_PRESETS.map((tpl) => {
            const isActive = tpl.id === selectedPresetId;
            return (
              <div
                key={tpl.id}
                onClick={() => setSelectedPresetId(tpl.id)}
                className={`p-4 rounded-lg border text-left cursor-pointer transition flex flex-col justify-between space-y-2 h-34 ${
                  isActive 
                    ? 'border-[#111111] bg-white ring-1 ring-[#111111] shadow-xs' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.2 rounded font-sans uppercase">
                      {tpl.category}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400 flex items-center gap-0.5 font-medium">
                      <Clock className="w-3 h-3" /> {tpl.durationFmt}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-[#111111] line-clamp-1">{tpl.title}</h3>
                  <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">{tpl.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column: Blueprint detail and copy board */}
        <div className="lg:col-span-7 bg-white border border-[#e5e7eb] rounded-xl p-6 text-left flex flex-col justify-between">
          <div className="space-y-5">
            
            {/* Header info */}
            <div className="pb-4 border-b border-gray-100 flex items-start justify-between">
              <div className="space-y-1.5 max-w-[80%]">
                <span className="text-[10px] font-mono text-gray-400 uppercase font-bold tracking-wider block">Active Outline Structure</span>
                <h3 className="text-base font-black text-[#111111] leading-tight">{selectedTemplate.title}</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed font-sans">{selectedTemplate.description}</p>
              </div>

              {/* Start using trigger button */}
              <button
                onClick={() => onSelectTemplate(selectedTemplate.title, selectedTemplate.description, selectedTemplate.category)}
                className="bg-[#111111] hover:bg-gray-800 text-white p-2 md:px-3 md:py-2 rounded-md font-semibold text-xs transition duration-150 flex items-center gap-1 shrink-0"
                title="Launch recording using preset title"
              >
                <Play className="w-3.5 h-3.5 text-white fill-white" />
                <span className="hidden md:inline">Use Template</span>
              </button>
            </div>

            {/* Step-by-Step Agenda Bullets */}
            <div className="space-y-2.5">
              <span className="text-[10px] uppercase font-bold tracking-wide text-gray-400 block font-mono">Recommended Discussion Agenda</span>
              <ul className="space-y-2 text-[11.5px] text-gray-600 font-sans leading-relaxed">
                {selectedTemplate.agenda.map((ag, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-50 text-purple-600 font-bold border border-purple-100 text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="flex-1 text-[#111111]/90">{ag}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Raw reusable markdown clipboard board */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wide text-gray-400 font-mono">MD Template Notes Input (Copy to Clipboard)</span>
                <button
                  onClick={() => handleCopy(selectedTemplate.templateSnippet, selectedTemplate.id)}
                  className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:underline text-[10.5pt] font-mono"
                >
                  {copiedId === selectedTemplate.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-blue-500" />
                      <span>Copy Outline</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-[#FAFBFD] border border-gray-150 rounded-lg p-4 font-mono text-[10.5px] text-gray-600 h-[120px] overflow-y-auto overflow-hidden text-left relative">
                <pre className="whitespace-pre-wrap select-all font-mono leading-relaxed">{selectedTemplate.templateSnippet}</pre>
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center gap-2 mt-4 text-[10.5px] text-gray-400 italic">
            <Award className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>Guarantees 98%+ multi-modal speech keyword alignment model.</span>
          </div>

        </div>

      </div>

    </div>
  );
};
