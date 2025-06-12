'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Gavel, Sparkles } from 'lucide-react';

interface CaseFormProps {
  onSubmit: (caseDescription: string) => void;
  isLoading?: boolean;
}

export function CaseForm({ onSubmit, isLoading = false }: CaseFormProps) {
  const [caseDescription, setCaseDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (caseDescription.trim()) {
      onSubmit(caseDescription);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg">
              <Gavel className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
              LawyerBot Tribunal
            </h1>
            <div className="p-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 shadow-lg">
              <Gavel className="w-8 h-8 text-white scale-x-[-1]" />
            </div>
          </div>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Enter your dispute and watch AI lawyers battle it out in court. 
            Our digital tribunal will hear both sides and deliver a verdict.
          </p>
        </div>

        {/* Main Form Card */}
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="case-description" className="text-2xl font-semibold text-white flex items-center space-x-2">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                  <span>Describe Your Dispute</span>
                </Label>
                <p className="text-blue-100 text-lg leading-relaxed">
                  Provide details about the conflict, who's involved, and what happened.
                </p>
              </div>
              
              <Textarea
                id="case-description"
                placeholder="Example: My roommate keeps eating my food without asking. I buy groceries every week, but when I go to cook dinner, half my ingredients are gone. They claim they'll pay me back but never do. This has been going on for two months and I'm spending twice as much on food..."
                value={caseDescription}
                onChange={(e) => setCaseDescription(e.target.value)}
                className="min-h-[200px] resize-none backdrop-blur-sm bg-white/10 border-white/30 text-white placeholder:text-blue-200 text-lg rounded-2xl focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
                required
              />
              
              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  disabled={isLoading || !caseDescription.trim()}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-12 py-4 text-xl font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Starting Trial...</span>
                    </div>
                  ) : (
                    'Begin Trial'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}