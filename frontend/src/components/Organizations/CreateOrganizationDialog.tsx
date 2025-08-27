import React, { useState ,useEffect} from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Building2, X, Upload, Check, Users, ArrowRight,Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface CreateOrganizationDialogProps {
  //isOpen: boolean;
  //onClose: () => void;
  onCreateOrganization: (organization: {
    name: string;
    adminEmail: string;
    logo?: string;
  }) => Promise<CreateOrgResult>;
}

type CreateOrgResult = {
  success: boolean;
  message?: string;
};

const CreateOrganizationDialog: React.FC<CreateOrganizationDialogProps> = ({
  //isOpen,
  //onClose,
  onCreateOrganization,
}) => {
  useEffect(() => {
    console.log("onCreateOrganization prop received:", typeof onCreateOrganization);
  }, []);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [logo, setLogo] = useState("");
  const [step, setStep] = useState(0);
  const { toast } = useToast();

  const [isCreating, setIsCreating] = useState(false);

  const resetForm = () => {
    setName("");
    setAdminEmail("");
    setLogo("");
    setStep(0);
  };

  
  const closeDialog = () => {
    setOpen(false);
    setTimeout(resetForm, 300);
  };
  
  
  const handleNext = () => {
    if (isCreating) return; // Prevent double submit

    console.log("Current step:", step); 

    if (step === 0 && !name.trim()) {
      toast({
        title: "Organization name required",
        description: "Please enter a name for your organization.",
        variant: "destructive",
      });
      return;
    }
    
    if (step === 1 && !adminEmail.trim()) {
      toast({
        title: "Admin email required",
        description: "Please enter an admin email for your organization.",
        variant: "destructive",
      });
      return;
    }
    
    if (step < 2) {
      setStep(step + 1);
    } else {
      console.log("Calling handleSubmit()"); // ADD THIS
      handleSubmit();
    }
  };

  /*
  const handleSubmit = () => {
    
    const orgData = {
    name,
    adminEmail,
    logo: logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`,
    };
    
    console.log("Submitting organization:", orgData); // ADD THIS
    onCreateOrganization(orgData);

    

    toast({
      title: "Organization created",
      description: `${name} has been created successfully.`,
    });
    
    closeDialog();
  };
*/

const handleSubmit = async () => {
  //as soon the Create button is clicked , change the button state to Creating..
  setIsCreating(true); // Start loading

  const orgData = {
    name,
    adminEmail,
    logo: logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`,
  };

  console.log("Submitting organization:", orgData);

  const result = await onCreateOrganization(orgData);

  if (result?.success) {
    toast({
      title: "Organization created",
      description: `${name} has been created successfully.`,
    });
    closeDialog();
  } else {
    const userFriendlyMessage =
    result?.message === "Organization with this name already exists"
      ? "An organization with this name already exists. Please choose a different name."
      : result?.message || "Unknown error occurred.";

    toast({
        variant: "destructive",
        title: "Failed to create organization",
        description: userFriendlyMessage,
      });
  }
  //resetting button state.
   setIsCreating(false);
};


  const steps = [
    {
      title: "Organization Name",
      description: "What is your organization called?",
      icon: Building2,
      /*
      component: (
        <div className="space-y-4 py-4">
          <Label htmlFor="name" className="text-base">
            Organization Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Acme Corporation"
            className="h-12 text-lg"
            autoFocus
          />
        </div>
      ),
      */
     component: (
      
      <div className="space-y-2 p-0 m-0 bg-transparent border-none shadow-none">
      {/*   
      <div className="space-y-4 py-4"> 
      */}
        <Label htmlFor="name" className="text-base text-white">
          Organization Name
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Acme Corporation"
          /*
          className="h-12 text-lg bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          */
         className="h-12 text-lg bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus-visible:outline-none focus-visible:ring-0 rounded-md"
          autoFocus={step === 0}
        />
      </div>
      ),

    },
    {
      title: "Admin Contact",
      description: "Who will be the primary administrator?",
      icon: Users,
      component: (
        <div className="space-y-4 py-4">
          <Label htmlFor="adminEmail" className="text-base">
            Admin Email
          </Label>
          <Input
            id="adminEmail"
            type="email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            placeholder="admin@acme.com"
            /*className="h-12 text-lg"*/
            className="h-12 text-lg bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus-visible:outline-none focus-visible:ring-0 rounded-md"
            autoFocus
          />
        </div>
      ),
    },
    {
      title: "Organization Logo",
      description: "Add a logo for your organization (optional)",
      icon: Upload,
      component: (
        <div className="space-y-4 py-4">
          <Label htmlFor="logo" className="text-base">
            Logo URL
          </Label>
          <Input
            id="logo"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            placeholder="https://example.com/logo.png"
            /*className="h-12 text-lg"*/
            className="h-12 text-lg bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus-visible:outline-none focus-visible:ring-0 rounded-md"
            autoFocus
          />
          <div className="flex justify-center pt-4">
            <div className="bg-gray-100 h-32 w-32 rounded-2xl flex items-center justify-center overflow-hidden">
              {logo ? (
                <img src={logo} alt="Logo preview" className="h-full w-full object-cover" />
              ) : (
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name || "Organization")}&background=0D8ABC&color=fff&size=128`} 
                  alt="Default logo" 
                  className="h-full w-full object-cover" 
                />
              )}
            </div>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-4">
            A default logo will be generated if none is provided.
          </p>
        </div>
      ),
    },
  ];

  return (
    
    <Dialog open={open} onOpenChange={setOpen}>
    
    
      <DialogTrigger asChild>
        <Button data-create-org-trigger="true" 
                /*className="bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white gap-2 h-12 px-6"*/
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md">
          <PlusCircle className="h-5 w-5" />
          New Organization
        </Button>
      </DialogTrigger>
   
   {/*
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 flex items-center justify-center text-white">
              {React.createElement(steps[step].icon, { className: "h-5 w-5" })}
            </div>
            <div>
              <DialogTitle className="text-xl">{steps[step].title}</DialogTitle>
              <DialogDescription>{steps[step].description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {steps[step].component}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between p-6 pt-2 border-t">
          <div className="flex gap-1.5">
            {steps.map((_, index) => (
              <div 
                key={index} 
                className={`h-2 w-10 rounded-full ${index === step ? 'bg-brand-500' : 'bg-gray-200'}`}
              />
            ))}
          </div>
          <div className="flex gap-3">
            
            <Button 
              onClick={handleNext} 
              disabled={isCreating}
              className={`gap-2 ${step === 2 ? 'bg-green-600 hover:bg-green-700' : ''}`}
            >
              {step === 2 ? (
                isCreating ? (
                  <>
                  
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Create
                  </>
                )
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

          </div>
        </div>
      </DialogContent>
      */}

      {/*
      following to Shooting star component and glass morphism , updating dialog component 
        */}

      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-black/40 backdrop-blur-md border border-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.15)] rounded-2xl">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-white">
              {React.createElement(steps[step].icon, { className: "h-5 w-5" })}
            </div>
            <div>
              <DialogTitle className="text-xl text-white">{steps[step].title}</DialogTitle>
              <DialogDescription className="text-sm text-gray-300">
                {steps[step].description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-4 py-4">
                {React.cloneElement(steps[step].component as React.ReactElement, {
                  className: "bg-white/5 border border-white/10 text-white placeholder-gray-400",
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between p-6 pt-2 border-t border-white/10">
          <div className="flex gap-1.5">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-10 rounded-full ${
                  index === step ? 'bg-blue-500' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-3">
            {/* Back Button (only if step > 0) */}
            {step > 0 && (
              <Button
                onClick={() => setStep(step - 1)}
                variant="ghost"
                className="text-white hover:text-gray-200"
              >
                Back
              </Button>
            )}

            <Button
              onClick={handleNext}
              disabled={isCreating}
              className={`gap-2 px-4 py-2 text-white rounded-md ${
                step === 2 ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {step === 2 ? (
                isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Create
                  </>
                )
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>

    </Dialog>
  );
};

export default CreateOrganizationDialog;
