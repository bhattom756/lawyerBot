'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { sampleCases } from '@/lib/sample-cases';
import { TestCase } from '@/lib/types';
import { Gavel, Sparkles } from 'lucide-react';

interface CaseFormProps {
  onSubmit: (caseDescription: string, testCase?: TestCase) => void;
  isLoading?: boolean;
}

export function CaseForm({ onSubmit, isLoading = false }: CaseFormProps) {
  const [caseDescription, setCaseDescription] = useState('');
  const [selectedSample, setSelectedSample] = useState<TestCase | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const description = selectedSample?.context || caseDescription;
    if (description.trim()) {
      onSubmit(description, selectedSample || undefined);
    }
  };

  const handleSampleSelect = (sample: TestCase) => {
    setSelectedSample(sample);
    setCaseDescription(sample.context);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Gavel className="w-8 h-8 text-judicial" />
          <h1 className="text-4xl font-bold text-judicial">LawyerBot Tribunal</h1>
          <Gavel className="w-8 h-8 text-judicial scale-x-[-1]" />
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Enter your dispute and watch AI lawyers battle it out in court. 
          Our digital tribunal will hear both sides and deliver a verdict.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Sample Cases */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <span>Try a Sample Case</span>
          </h2>
          <div className="space-y-3">
            {sampleCases.map((sample) => (
              <Card
                key={sample.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-md border-2 ${
                  selectedSample?.id === sample.id 
                    ? 'border-accent bg-accent/5' 
                    : 'border-border hover:border-accent/50'
                }`}
                onClick={() => handleSampleSelect(sample)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-sm mb-1">{sample.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      {sample.description}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {sample.category}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Custom Case Input */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="case-description" className="text-lg font-semibold">
                Describe Your Dispute
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                Provide details about the conflict, who's involved, and what happened.
              </p>
            </div>
            
            <Textarea
              id="case-description"
              placeholder="Example: My roommate keeps eating my food without asking. I buy groceries every week, but when I go to cook dinner, half my ingredients are gone. They claim they'll pay me back but never do. This has been going on for two months and I'm spending twice as much on food..."
              value={caseDescription}
              onChange={(e) => setCaseDescription(e.target.value)}
              className="min-h-[200px] resize-none"
              required
            />
            
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                {selectedSample && (
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{selectedSample.title}</Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedSample(null);
                        setCaseDescription('');
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </div>
              
              <Button
                type="submit"
                disabled={isLoading || !caseDescription.trim()}
                className="bg-judicial hover:bg-judicial/90 text-white px-8"
              >
                {isLoading ? 'Starting Trial...' : 'Begin Trial'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}