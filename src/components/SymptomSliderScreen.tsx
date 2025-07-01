
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { HealthSlider } from "./HealthSlider";

interface SymptomSliderScreenProps {
  currentScreen: number;
  totalScreens: number;
  symptoms: SymptomDefinition[];
  responses: Record<string, number>;
  onSymptomChange: (symptomId: string, value: number) => void;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
}

interface SymptomDefinition {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

export const SymptomSliderScreen: React.FC<SymptomSliderScreenProps> = ({
  currentScreen,
  totalScreens,
  symptoms,
  responses,
  onSymptomChange,
  onNext,
  onBack,
  canProceed
}) => {
  const progress = ((currentScreen + 1) / totalScreens) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <Card className="w-full max-w-5xl">
        <CardHeader className="text-center">
          <div className="mb-4">
            <Progress value={progress} className="w-full mb-2" />
            <p className="text-sm text-gray-600">
              Screen {currentScreen + 1} of {totalScreens}
            </p>
          </div>
          <CardTitle className="text-2xl font-bold text-purple-600">
            Symptom Intensity Assessment
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Please rate the intensity of each symptom you've experienced
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
            {symptoms.map((symptom) => (
              <div key={symptom.id} className="flex justify-center">
                <div className="w-full max-w-sm">
                  <div className="text-center mb-4">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      {symptom.name}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {symptom.description}
                    </p>
                  </div>
                  <HealthSlider
                    questionText=""
                    emoji={symptom.emoji}
                    minLabel="Not Present"
                    maxLabel="Severe"
                    minValue={0}
                    maxValue={10}
                    value={responses[symptom.id] || 0}
                    onChange={(value) => onSymptomChange(symptom.id, value)}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-8">
            <Button
              onClick={onBack}
              variant="outline"
              disabled={currentScreen === 0}
              className="rounded-full"
            >
              Back
            </Button>
            
            <Button
              onClick={onNext}
              disabled={!canProceed}
              className="rounded-full"
            >
              {currentScreen === totalScreens - 1 ? 'Complete Assessment' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
