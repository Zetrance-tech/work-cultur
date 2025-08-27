
import React, { useState } from "react";
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
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Save } from "lucide-react";
import { organizations, departments } from "@/data/mockData";
import { toast } from "sonner";

interface CoursePublishDialogProps {
  onPublish: (data: {
    organizationIds: string[];
    departmentIds: string[];
  }) => void;
}

const CoursePublishDialog: React.FC<CoursePublishDialogProps> = ({ onPublish }) => {
  const [selectedOrgs, setSelectedOrgs] = useState<Record<string, boolean>>({});
  const [selectedDepts, setSelectedDepts] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState(false);

  const handleOrgSelect = (orgId: string, checked: boolean) => {
    setSelectedOrgs(prev => ({
      ...prev,
      [orgId]: checked
    }));
    
    // If org is unselected, unselect all its departments
    if (!checked) {
      const orgDepartments = departments.filter(dept => dept.organizationId === orgId);
      const updatedDepts = { ...selectedDepts };
      
      orgDepartments.forEach(dept => {
        updatedDepts[dept.id] = false;
      });
      
      setSelectedDepts(updatedDepts);
    }
  };

  const handleDeptSelect = (deptId: string, checked: boolean) => {
    setSelectedDepts(prev => ({
      ...prev,
      [deptId]: checked
    }));
    
    // If a department is selected, ensure its organization is selected
    if (checked) {
      const dept = departments.find(d => d.id === deptId);
      if (dept) {
        setSelectedOrgs(prev => ({
          ...prev,
          [dept.organizationId]: true
        }));
      }
    }
  };

  const handlePublish = () => {
    const selectedOrgIds = Object.keys(selectedOrgs).filter(id => selectedOrgs[id]);
    const selectedDeptIds = Object.keys(selectedDepts).filter(id => selectedDepts[id]);
    
    if (selectedOrgIds.length === 0) {
      toast.error("Please select at least one organization");
      return;
    }
    
    onPublish({
      organizationIds: selectedOrgIds,
      departmentIds: selectedDeptIds
    });
    
    setOpen(false);
    toast.success("Course published successfully");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Publish Course
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Publish Course</DialogTitle>
          <DialogDescription>
            Select the organizations and departments to publish this course to.
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-[50vh] overflow-y-auto py-4">
          <Accordion type="multiple" className="w-full">
            {organizations.map(org => {
              const orgDepartments = departments.filter(
                dept => dept.organizationId === org.id
              );
              
              return (
                <AccordionItem key={org.id} value={org.id}>
                  <div className="flex items-center space-x-2 py-1">
                    <Checkbox 
                      id={`org-${org.id}`}
                      checked={selectedOrgs[org.id] || false}
                      onCheckedChange={(checked) => 
                        handleOrgSelect(org.id, checked === true)
                      }
                    />
                    <AccordionTrigger className="hover:no-underline">
                      <label 
                        htmlFor={`org-${org.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {org.name}
                      </label>
                    </AccordionTrigger>
                  </div>
                  <AccordionContent>
                    <div className="pl-6 space-y-2">
                      {orgDepartments.map(dept => (
                        <div key={dept.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`dept-${dept.id}`}
                            checked={selectedDepts[dept.id] || false}
                            disabled={!selectedOrgs[org.id]}
                            onCheckedChange={(checked) => 
                              handleDeptSelect(dept.id, checked === true)
                            }
                          />
                          <label 
                            htmlFor={`dept-${dept.id}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {dept.name}
                          </label>
                        </div>
                      ))}
                      {orgDepartments.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          No departments found
                        </p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={handlePublish}>
            Publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CoursePublishDialog;
