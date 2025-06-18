import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar, User, Heart, Utensils } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface OnboardingFlowProps {
  onComplete: () => void;
}

interface QuestionnaireResponses {
  lastPeriodStart: 'current' | 'calendar' | 'unknown' | 'no-period-yet' | 'stopped-period';
  cycleLength: number;
  worstSymptom: string;
  selectedDate: string | null;
}

const defaultResponses: QuestionnaireResponses = {
  lastPeriodStart: 'unknown',
  cycleLength: 28,
  worstSymptom: '',
  selectedDate: null,
};

const determineUserType = (lastPeriodStart: string) => {
  if (lastPeriodStart === 'current') {
    return 'MENSTRUAL';
  } else if (lastPeriodStart === 'calendar') {
    return 'MENSTRUAL';
  } else if (lastPeriodStart === 'unknown') {
    return 'MENSTRUAL';
  } else {
    return 'PRE_MENSTRUAL';
  }
};

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<QuestionnaireResponses>(defaultResponses);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const updateResponses = (updates: Partial<QuestionnaireResponses>) => {
    setResponses((prev) => ({ ...prev, ...updates }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    updateResponses({ selectedDate: date ? date.toISOString().split('T')[0] : null });
  };

  const isCurrentQuestionAnswered = () => {
    switch (currentStep) {
      case 0:
        return !!responses.lastPeriodStart;
      case 1:
        return !!responses.cycleLength;
      case 2:
        return !!responses.worstSymptom;
      default:
        return true;
    }
  };

  const handleComplete = async () => {
    console.log('=== STARTING ONBOARDING COMPLETION ===');
    console.log('Current responses:', responses);
    
    setIsSubmitting(true);
    
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Error getting user:', userError);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please log in and try again."
        });
        setIsSubmitting(false);
        return;
      }

      console.log('User authenticated:', user.id);

      // Determine user type
      const userType = determineUserType(responses.lastPeriodStart);
      console.log('Determined user type:', userType);

      // Save user type
      const { error: userTypeError } = await supabase
        .from('user_types')
        .upsert({
          user_id: user.id,
          user_type: userType,
          classification_date: new Date().toISOString().split('T')[0]
        });

      if (userTypeError) {
        console.error('Error saving user type:', userTypeError);
        throw userTypeError;
      }

      console.log('User type saved successfully');

      // Save questionnaire responses
      const questionnairesToSave = [
        {
          user_id: user.id,
          questionnaire_type: 'onboarding',
          question_id: 'lastPeriodStart',
          question_text: 'When did your last period start?',
          answer_value: responses.lastPeriodStart,
          answer_type: 'single_choice',
          user_type: userType,
        },
        {
          user_id: user.id,
          questionnaire_type: 'onboarding',
          question_id: 'cycleLength',
          question_text: 'How long is your cycle typically?',
          answer_value: responses.cycleLength.toString(),
          answer_type: 'single_choice',
          user_type: userType,
        },
        {
          user_id: user.id,
          questionnaire_type: 'onboarding',
          question_id: 'worstSymptom',
          question_text: 'What is your worst period symptom?',
          answer_value: responses.worstSymptom,
          answer_type: 'single_choice',
          user_type: userType,
        }
      ];

      const { error: responsesError } = await supabase
        .from('questionnaire_responses')
        .insert(questionnairesToSave);

      if (responsesError) {
        console.error('Error saving questionnaire responses:', responsesError);
        throw responsesError;
      }

      console.log('Questionnaire responses saved successfully');

      // Create cycle tracking data if user selected calendar date
      if (responses.lastPeriodStart === 'calendar' && responses.selectedDate) {
        const { error: cycleError } = await supabase
          .from('cycle_tracking')
          .insert({
            user_id: user.id,
            cycle_start_date: responses.selectedDate,
            cycle_length: responses.cycleLength,
            period_length: 7 // default value
          });

        if (cycleError) {
          console.error('Error saving cycle tracking:', cycleError);
          // Don't throw here - cycle tracking is optional
        } else {
          console.log('Cycle tracking data saved successfully');
        }
      }

      // Mark onboarding as completed
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        throw profileError;
      }

      console.log('Profile updated - onboarding marked as completed');

      // Show success message
      toast({
        title: "Welcome to Uteroo!",
        description: "Your profile has been set up successfully."
      });

      console.log('=== ONBOARDING COMPLETION SUCCESSFUL ===');
      console.log('Navigating to game for user type:', userType);

      // Navigate based on user type
      if (userType === 'PRE_MENSTRUAL') {
        console.log('Redirecting to pre-period game');
        navigate('/pre-period-game');
      } else {
        console.log('Redirecting to pou game');
        navigate('/pou-game');
      }

      // Call onComplete callback
      if (onComplete) {
        onComplete();
      }

    } catch (error) {
      console.error('=== ONBOARDING COMPLETION FAILED ===');
      console.error('Error during onboarding completion:', error);
      toast({
        variant: "destructive",
        title: "Setup Failed",
        description: "There was an error setting up your profile. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderLastPeriodQuestion = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">When did your last period start?</h2>
        <p className="text-gray-600">This helps us personalize your experience.</p>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant={responses.lastPeriodStart === 'current' ? 'default' : 'outline'}
            onClick={() => updateResponses({ lastPeriodStart: 'current' })}
            className="w-full"
          >
            Currently on my period
          </Button>
          <Button
            variant={responses.lastPeriodStart === 'calendar' ? 'default' : 'outline'}
            onClick={() => updateResponses({ lastPeriodStart: 'calendar' })}
            className="w-full"
          >
            Choose from calendar
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Button
            variant={responses.lastPeriodStart === 'unknown' ? 'default' : 'outline'}
            onClick={() => updateResponses({ lastPeriodStart: 'unknown' })}
            className="w-full"
          >
            I'm not sure when my last period was
          </Button>
          <Button
            variant={responses.lastPeriodStart === 'no-period-yet' ? 'default' : 'outline'}
            onClick={() => updateResponses({ lastPeriodStart: 'no-period-yet' })}
            className="w-full"
          >
            I haven't had my first period yet
          </Button>
          <Button
            variant={responses.lastPeriodStart === 'stopped-period' ? 'default' : 'outline'}
            onClick={() => updateResponses({ lastPeriodStart: 'stopped-period' })}
            className="w-full"
          >
            I'm no longer having periods
          </Button>
        </div>

        {responses.lastPeriodStart === 'calendar' && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-700">Select Date</h3>
            <p className="text-gray-500">Please select the first day of your last period.</p>
            <CalendarComponent onDateSelect={handleDateSelect} />
          </div>
        )}
      </div>
    );
  };

  const renderCycleLengthQuestion = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">How long is your cycle typically?</h2>
        <p className="text-gray-600">The average cycle length is 28 days.</p>

        <div className="grid grid-cols-3 gap-4">
          {[21, 28, 35].map((length) => (
            <Button
              key={length}
              variant={responses.cycleLength === length ? 'default' : 'outline'}
              onClick={() => updateResponses({ cycleLength: length })}
              className="w-full"
            >
              {length} days
            </Button>
          ))}
          <input
            type="number"
            placeholder="Custom length"
            value={responses.cycleLength}
            onChange={(e) => updateResponses({ cycleLength: parseInt(e.target.value) })}
            className="col-span-3 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>
    );
  };

  const renderWorstSymptomQuestion = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">What is your worst period symptom?</h2>
        <p className="text-gray-600">Knowing this helps us provide tailored advice.</p>

        <div className="grid grid-cols-2 gap-4">
          {['cramps', 'bloating', 'mood swings', 'fatigue'].map((symptom) => (
            <Button
              key={symptom}
              variant={responses.worstSymptom === symptom ? 'default' : 'outline'}
              onClick={() => updateResponses({ worstSymptom: symptom })}
              className="w-full capitalize"
            >
              {symptom}
            </Button>
          ))}
          <input
            type="text"
            placeholder="Other symptom"
            value={responses.worstSymptom}
            onChange={(e) => updateResponses({ worstSymptom: e.target.value })}
            className="col-span-2 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>
    );
  };

  const renderSummaryScreen = () => {
    const userType = determineUserType(responses.lastPeriodStart);
    
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">You're All Set!</h2>
          <p className="text-gray-600">Here's what we learned about you:</p>
        </div>

        <div className="space-y-4">
          <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-pink-500" />
                <div>
                  <p className="font-semibold text-gray-800">Period Status</p>
                  <p className="text-sm text-gray-600">
                    {responses.lastPeriodStart === 'current' && 'Currently on your period'}
                    {responses.lastPeriodStart === 'calendar' && `Last period: ${responses.selectedDate || 'Selected date'}`}
                    {responses.lastPeriodStart === 'unknown' && 'Not sure when last period was'}
                    {responses.lastPeriodStart === 'no-period-yet' && "Haven't had your first period yet"}
                    {responses.lastPeriodStart === 'stopped-period' && 'No longer having periods'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Heart className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="font-semibold text-gray-800">Cycle Length</p>
                  <p className="text-sm text-gray-600">{responses.cycleLength} days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-indigo-50 to-pink-50 border-indigo-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Utensils className="w-5 h-5 text-indigo-500" />
                <div>
                  <p className="font-semibold text-gray-800">Main Concern</p>
                  <p className="text-sm text-gray-600 capitalize">{responses.worstSymptom}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-4">
          <p className="text-sm text-gray-500">
            Based on your responses, you'll be using the {userType.toLowerCase().replace('_', ' ')} version of Uteroo.
          </p>
          
          <Button 
            onClick={handleComplete}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-semibold py-3 rounded-full"
          >
            {isSubmitting ? "Setting up your profile..." : "Continue to Game"}
          </Button>
        </div>
      </div>
    );
  };

  const CalendarComponent = ({ onDateSelect }: { onDateSelect: (date: Date | undefined) => void }) => {
    const [date, setDate] = useState<Date>();

    useEffect(() => {
      onDateSelect(date);
    }, [date, onDateSelect]);

    return (
      <div className="border rounded-md p-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="w-full"
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Welcome to Uteroo
          </h1>
          <p className="text-gray-600 mt-2">Let's get to know you better</p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <CardContent className="p-8">
            {currentStep === 0 && renderLastPeriodQuestion()}
            {currentStep === 1 && renderCycleLengthQuestion()}
            {currentStep === 2 && renderWorstSymptomQuestion()}
            {currentStep === 3 && renderSummaryScreen()}
            
            {currentStep < 3 && (
              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center space-x-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Button>
                
                <Button 
                  onClick={handleNext}
                  disabled={!isCurrentQuestionAnswered()}
                  className="flex items-center space-x-2 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
