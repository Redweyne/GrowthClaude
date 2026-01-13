'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus, ChevronRight, Calendar } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui';
import { IdentityPromptModal } from './IdentityPromptModal';

export function IdentityJourney() {
  const { getIdentityStatements, name } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statements = getIdentityStatements();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getContextLabel = (context: { type: string; description: string }) => {
    return context.description || context.type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Identity Journey
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            {statements.length === 0
              ? 'Define who you are becoming'
              : `${statements.length} identity statement${statements.length === 1 ? '' : 's'} claimed`}
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Add
        </Button>
      </div>

      {/* Empty state */}
      {statements.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-amber-500/5 to-purple-500/5 border border-amber-500/20 rounded-2xl p-8 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/10 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-amber-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Who are you becoming?
          </h3>
          <p className="text-zinc-400 text-sm mb-6 max-w-xs mx-auto">
            Identity statements help you define and reinforce who you want to be.
            The person you claim to be today shapes who you become tomorrow.
          </p>
          <Button onClick={() => setIsModalOpen(true)}>
            <Sparkles size={16} className="mr-2" />
            Create Your First Statement
          </Button>
        </motion.div>
      )}

      {/* Timeline */}
      {statements.length > 0 && (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/50 via-purple-500/30 to-transparent" />

          {/* Statements */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {statements.map((statement, index) => (
                <motion.div
                  key={statement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-14"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 top-4 w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-zinc-900 shadow-lg shadow-amber-500/30" />

                  {/* Card */}
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-amber-500/30 transition-colors group">
                    {/* Date and context */}
                    <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                      <Calendar size={12} />
                      <span>{formatDate(statement.createdAt)}</span>
                      <span className="text-zinc-700">|</span>
                      <span className="text-amber-400/70">
                        {getContextLabel(statement.context)}
                      </span>
                    </div>

                    {/* Statement */}
                    <p className="text-white leading-relaxed">
                      <span className="text-amber-400 font-medium">I am someone who </span>
                      {statement.statement.replace(/^I am someone who\s*/i, '')}
                    </p>

                    {/* Tags */}
                    {statement.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {statement.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-zinc-800 rounded-full text-xs text-zinc-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Evolution summary */}
          {statements.length >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 ml-14 bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <ChevronRight className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium text-amber-400">Your Evolution</span>
              </div>
              <p className="text-sm text-zinc-300">
                {name ? `${name}, you` : 'You'}&apos;ve claimed {statements.length} identities.
                Each statement is a promise to yourself - a declaration of who you are becoming.
                Keep showing up as this person.
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* Modal */}
      <IdentityPromptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        context={{
          type: 'manual',
          trigger: 'manual',
          description: 'Self-initiated',
        }}
      />
    </div>
  );
}

export default IdentityJourney;
