
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Check, AlertCircle } from 'lucide-react';

const formSchema = z.object({
  // Demographic Information
  patientId: z.string().min(1, "Patient ID is required"),
  age: z.string().min(1, "Age is required"),
  gender: z.string().min(1, "Gender is required"),
  race: z.string().optional(),
  
  // Medical History
  diabetes: z.boolean().default(false),
  hypertension: z.boolean().default(false),
  heartDisease: z.boolean().default(false),
  renalDisease: z.boolean().default(false),
  copd: z.boolean().default(false),
  cancer: z.boolean().default(false),
  
  // Hospital Stay Details
  lengthOfStay: z.string().min(1, "Length of stay is required"),
  admissionType: z.string().min(1, "Admission type is required"),
  dischargeDisposition: z.string().min(1, "Discharge disposition is required"),
  
  // Treatment Data
  medicationCount: z.string().min(1, "Medication count is required"),
  proceduresCount: z.string().min(1, "Procedures count is required"),
  labTestsCount: z.string().min(1, "Lab tests count is required"),
  
  // Post-Discharge
  followUpScheduled: z.boolean().default(false),
  homeCareOrdered: z.boolean().default(false),
  
  // Risk Factors
  readmissionHistory: z.string().min(1, "Readmission history is required"),
  complicationRisk: z.coerce.number().min(0).max(100),
});

type FormValues = z.infer<typeof formSchema>;

const PatientForm = ({ onSubmit: onExternalSubmit }: { onSubmit?: (data: FormValues) => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      age: "",
      gender: "",
      race: "",
      diabetes: false,
      hypertension: false,
      heartDisease: false,
      renalDisease: false,
      copd: false,
      cancer: false,
      lengthOfStay: "",
      admissionType: "",
      dischargeDisposition: "",
      medicationCount: "",
      proceduresCount: "",
      labTestsCount: "",
      followUpScheduled: false,
      homeCareOrdered: false,
      readmissionHistory: "0",
      complicationRisk: 0,
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onExternalSubmit) {
        onExternalSubmit(data);
      } else {
        console.log("Form submitted:", data);
        toast.success("Patient data submitted successfully", {
          description: "The prediction model is now analyzing the data.",
          icon: <Check className="w-4 h-4" />,
        });
      }
      
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit patient data", {
        description: "Please try again or contact support.",
        icon: <AlertCircle className="w-4 h-4" />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-medical-500 to-medical-600 px-6 py-4">
        <h2 className="text-xl font-medium text-white">Patient Readmission Risk Assessment</h2>
        <p className="text-medical-100 text-sm mt-1">
          Enter patient information to predict 30-day readmission risk
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6">
          <Tabs defaultValue="demographic" className="w-full">
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="demographic">Demographics</TabsTrigger>
              <TabsTrigger value="medical">Medical History</TabsTrigger>
              <TabsTrigger value="hospital">Hospital Stay</TabsTrigger>
              <TabsTrigger value="treatment">Treatment</TabsTrigger>
              <TabsTrigger value="risk">Risk Factors</TabsTrigger>
            </TabsList>
            
            <TabsContent value="demographic" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="patientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter patient ID" {...field} className="input-clean" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter age" {...field} className="input-clean" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="input-clean">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="race"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Race/Ethnicity</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="input-clean">
                            <SelectValue placeholder="Select race/ethnicity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="white">White</SelectItem>
                          <SelectItem value="black">Black/African American</SelectItem>
                          <SelectItem value="hispanic">Hispanic/Latino</SelectItem>
                          <SelectItem value="asian">Asian</SelectItem>
                          <SelectItem value="native">American Indian/Alaska Native</SelectItem>
                          <SelectItem value="pacific">Native Hawaiian/Pacific Islander</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="medical" className="animate-fade-in">
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="diabetes"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer font-normal">Diabetes</FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="hypertension"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer font-normal">Hypertension</FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="heartDisease"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer font-normal">Heart Disease</FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="renalDisease"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer font-normal">Renal Disease</FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="copd"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer font-normal">COPD</FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cancer"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer font-normal">Cancer</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="hospital" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="lengthOfStay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Length of Stay (days)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter number of days" {...field} className="input-clean" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="admissionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admission Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="input-clean">
                            <SelectValue placeholder="Select admission type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="emergency">Emergency</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="elective">Elective</SelectItem>
                          <SelectItem value="trauma">Trauma</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dischargeDisposition"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Discharge Disposition</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="input-clean">
                            <SelectValue placeholder="Select discharge disposition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="home">Home</SelectItem>
                          <SelectItem value="home_health">Home Health Care</SelectItem>
                          <SelectItem value="snf">Skilled Nursing Facility</SelectItem>
                          <SelectItem value="rehab">Inpatient Rehabilitation</SelectItem>
                          <SelectItem value="ltach">Long-term Acute Care Hospital</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="treatment" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="medicationCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Medications</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter count" {...field} className="input-clean" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="proceduresCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Procedures</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter count" {...field} className="input-clean" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="labTestsCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Lab Tests</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter count" {...field} className="input-clean" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <FormField
                  control={form.control}
                  name="followUpScheduled"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer font-normal">Follow-up Appointment Scheduled</FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="homeCareOrdered"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer font-normal">Home Care Services Ordered</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="risk" className="animate-fade-in">
              <div className="grid grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="readmissionHistory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Previous Readmissions (past 12 months)</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="input-clean">
                            <SelectValue placeholder="Select number of readmissions" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">0</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4+">4 or more</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="complicationRisk"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complication Risk Level (0-100)</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          <Slider
                            value={[field.value]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(value) => field.onChange(value[0])}
                            className="py-4"
                          />
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Low Risk</span>
                            <span className="text-lg font-medium text-medical-800">{field.value}</span>
                            <span className="text-sm text-gray-500">High Risk</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-medical-600 hover:bg-medical-700 text-white px-8 rounded-lg shadow-sm hover:shadow transition-all"
            >
              {isSubmitting ? "Processing..." : "Calculate Risk Score"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PatientForm;
