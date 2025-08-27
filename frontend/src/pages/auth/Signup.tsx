////////////////////////////////

/*
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sendOTP, signup } from '../../api/authAPI';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, User, Lock, Shield, Building, Users, Briefcase, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Department {
  _id: string;
  name: string;
}

interface Organization {
  _id: string;
  name: string;
  departments: Department[];
}

interface OrganizationResponse {
  success: boolean;
  statusCode: number;
  status: string;
  message: string;
  data: Organization[];
  timestamp: string;
}

const Signup = () => {
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [organizationsLoading, setOrganizationsLoading] = useState(true);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setOrganizationsLoading(true);
        //const response = await fetch('http://localhost:5000/api/v1/org');
        const response = await fetch('http://localhost:5000/api/v1/org');
        const data: OrganizationResponse = await response.json();
        
        if (data.success) {
          setOrganizations(data.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch organizations",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch organizations. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setOrganizationsLoading(false);
      }
    };

    fetchOrganizations();
  }, [toast]);

  const getSelectedOrgDepartments = (): Department[] => {
    const selectedOrg = organizations.find(org => org._id === selectedOrganization);
    return selectedOrg?.departments || [];
  };

  const handleOrganizationChange = (orgId: string) => {
    setSelectedOrganization(orgId);
    setSelectedDepartment('');
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !password || !jobTitle || !selectedOrganization || !selectedDepartment) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await sendOTP(email);
      setStep('otp');
      toast({
        title: "OTP Sent",
        description: "Please check your email for the verification code",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      toast({
        title: "Error",
        description: "Please enter the OTP",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const signupData = {
        email,
        password,
        name,
        accountType: "employee",
        organization: selectedOrganization,
        department: selectedDepartment,
        jobTitle,
        otp
      };

      await signup(signupData);
      toast({
        title: "Success",
        description: "Account created successfully! Please login.",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please check your OTP and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-lg overflow-hidden rounded-2xl">
          <div className="flex flex-col lg:flex-row">
            
            <div className="hidden lg:block lg:w-2/5 bg-gradient-to-br from-green-600 to-emerald-700 p-12 text-white">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <img 
                    src="lovable-uploads/0323b2d6-af36-4b5d-88d0-c2dd4bbd9e2e.png" 
                    alt="Workcultur Logo" 
                    className="h-14 w-auto mb-8"
                  />
                  <h2 className="text-3xl font-bold mb-4">Welcome to Workcultur</h2>
                  <p className="text-green-100">
                    Join our platform to connect with your organization and streamline your workflow.
                  </p>
                </div>
                <div className="mt-8">
                  <p className="text-sm text-green-200">Trusted by thousands of professionals worldwide</p>
                </div>
              </div>
            </div>

           
            <div className="w-full lg:w-3/5 p-6 sm:p-8 lg:p-12">
              <div className="max-w-md mx-auto">
                
                <div className="lg:hidden text-center mb-8">
                  <img 
                    src="/lovable-Uploads/0323b2d6-af36-4b5d-88d0-c2dd4bbd9e2e.png" 
                    alt="Workcultur Logo" 
                    className="h-12 w-auto mx-auto mb-4"
                  />
                </div>

                
                <div className="flex justify-center mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'details' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                        {step === 'otp' ? <CheckCircle2 className="h-5 w-5" /> : '1'}
                      </div>
                      <span className="text-xs mt-2 text-gray-600">Details</span>
                    </div>
                    <div className="w-12 h-1 bg-gray-200 rounded-full">
                      <div className={`h-full rounded-full ${step === 'otp' ? 'bg-green-500 w-full' : 'bg-gray-200 w-0'}`}></div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'otp' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                        2
                      </div>
                      <span className="text-xs mt-2 text-gray-600">Verify</span>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {step === 'details' ? 'Create Your Account' : 'Verify Your Email'}
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {step === 'details' ? 'Enter your details to get started' : 'Enter the verification code sent to your email'}
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {step === 'details' ? (
                    <motion.form
                      key="details"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleSendOTP}
                      className="space-y-6"
                    >
                      
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Personal Information
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <motion.div 
                            className="space-y-2"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 rounded-lg"
                                required
                              />
                            </div>
                          </motion.div>

                          <motion.div 
                            className="space-y-2"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="email"
                                type="email"
                                placeholder="john@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 rounded-lg"
                                required
                              />
                            </div>
                          </motion.div>

                          <motion.div 
                            className="space-y-2"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="password"
                                type="password"
                                placeholder="Create password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 rounded-lg"
                                required
                              />
                            </div>
                          </motion.div>

                          <motion.div 
                            className="space-y-2"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">Job Title</Label>
                            <div className="relative">
                              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="jobTitle"
                                type="text"
                                placeholder="Software Engineer"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 rounded-lg"
                                required
                              />
                            </div>
                          </motion.div>
                        </div>
                      </div>

                      
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Organization Details
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <motion.div 
                            className="space-y-2"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Label htmlFor="organization" className="text-sm font-medium text-gray-700">Organization</Label>
                            <div className="relative">
                              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                              <Select 
                                value={selectedOrganization} 
                                onValueChange={handleOrganizationChange}
                                disabled={organizationsLoading}
                              >
                                <SelectTrigger className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 rounded-lg">
                                  <SelectValue placeholder={organizationsLoading ? "Loading..." : "Select organization"} />
                                </SelectTrigger>
                                <SelectContent>
                                  {organizations.map((org) => (
                                    <SelectItem key={org._id} value={org._id}>
                                      {org.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </motion.div>

                          <motion.div 
                            className="space-y-2"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Label htmlFor="department" className="text-sm font-medium text-gray-700">Department</Label>
                            <div className="relative">
                              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                              <Select 
                                value={selectedDepartment} 
                                onValueChange={setSelectedDepartment}
                                disabled={!selectedOrganization || getSelectedOrgDepartments().length === 0}
                              >
                                <SelectTrigger className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 rounded-lg">
                                  <SelectValue placeholder={
                                    !selectedOrganization 
                                      ? "Select organization first" 
                                      : getSelectedOrgDepartments().length === 0
                                      ? "No departments"
                                      : "Select department"
                                  } />
                                </SelectTrigger>
                                <SelectContent>
                                  {getSelectedOrgDepartments().map((dept) => (
                                    <SelectItem key={dept._id} value={dept._id}>
                                      {dept.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </motion.div>
                        </div>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button 
                          type="submit" 
                          className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl" 
                          disabled={loading || organizationsLoading}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Sending OTP...
                            </>
                          ) : (
                            'Send Verification Code'
                          )}
                        </Button>
                      </motion.div>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="otp"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleSignup}
                      className="space-y-6"
                    >
                      <motion.div 
                        className="text-center p-6 bg-green-50 rounded-lg border border-green-200"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Shield className="mx-auto h-12 w-12 text-green-600 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify Your Email</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          We've sent a 6-digit verification code to
                        </p>
                        <p className="font-medium text-green-600 break-all">{email}</p>
                      </motion.div>

                      <motion.div 
                        className="space-y-2"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Label htmlFor="otp" className="text-sm font-medium text-gray-700">Verification Code</Label>
                        <Input
                          id="otp"
                          type="text"
                          placeholder="Enter 6-digit code"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="text-center text-lg tracking-widest h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 rounded-lg"
                          maxLength={6}
                          required
                        />
                      </motion.div>

                      <div className="space-y-3">
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Button 
                            type="submit" 
                            className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl" 
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Creating Account...
                              </>
                            ) : (
                              'Create Account'
                            )}
                          </Button>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="w-full h-12 border-gray-200 hover:bg-gray-50 rounded-lg transition-all duration-200" 
                            onClick={() => setStep('details')}
                          >
                            Back to Details
                          </Button>
                        </motion.div>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold transition-colors duration-200">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;
*/

/*
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { signup } from '../../api/authAPI'; // Updated path
import { useAuth } from '../../contexts/AuthContext'; // Updated path
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, Clock, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShootingStars } from '@/components/ui/shooting-stars';
import { ElegantShape } from '@/components/ui/elegant-shape';

// Define types for API response
interface SignupResponse {
  ok: boolean;
  status: number;
  data?: { token: string; user: { id: string; email: string } };
  message?: string;
}

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const { login: authLogin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handle Esc key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showPendingModal) {
        setShowPendingModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPendingModal]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response: SignupResponse = await signup(email, password);

      if (response.status === 403) {
        setShowPendingModal(true);
        return;
      }

      if (!response.ok) {
        toast({
          title: 'Signup Failed',
          description: response.message || 'An error occurred during signup. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      if (response.data) {
        authLogin(response.data!); // Non-null assertion
        toast({
          title: 'Welcome!',
          description: 'You have successfully signed up.',
        });
        navigate('/dashboard');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      toast({
        title: 'Signup Failed',
        description: errorMessage.includes('Network Error')
          ? 'Unable to connect to the server. Please check your internet connection.'
          : 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white">
  
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-80" />
        <ShootingStars />
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-indigo-500/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-rose-500/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />
        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-violet-500/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />
        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-amber-500/[0.15]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />
        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-cyan-500/[0.15]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-4xl p-4 sm:p-6 lg:p-8"
      >
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-lg overflow-hidden rounded-2xl text-black">
          <div className="flex flex-col lg:flex-row">
  
            <div className="hidden lg:block lg:w-2/5 bg-gradient-to-br from-green-600 to-emerald-700 p-12 text-white">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <img
                    src="/lovable-uploads/0323b2d6-af36-4b5d-88d0-c2dd4bbd9e2e.png"
                    alt="Workcultur Logo"
                    className="h-14 w-auto mb-8"
                  />
                  <h2 className="text-3xl font-bold mb-4">Join Us</h2>
                  <p className="text-green-100">Create an account to get started.</p>
                </div>
                <div className="mt-8">
                  <p className="text-sm text-green-200">Trusted by thousands of professionals worldwide</p>
                </div>
              </div>
            </div>

  
            <div className="w-full lg:w-3/5 p-6 sm:p-8 lg:p-12">
              <div className="max-w-md mx-auto">
  
                <div className="lg:hidden text-center mb-8">
                  <img
                    src="/lovable-uploads/0323b2d6-af36-4b5d-88d0-c2dd4bbd9e2e.png"
                    alt="Workcultur Logo"
                    className="h-12 w-auto mx-auto mb-4"
                  />
                </div>

                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Sign Up</h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Create your account to get started
                  </p>
                </div>

                <motion.form
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSignup}
                  className="space-y-6"
                  aria-label="Signup form"
                >
                  <motion.div
                    className="space-y-2"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 rounded-lg"
                        required
                        disabled={loading}
                        aria-describedby="email-error"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 rounded-lg"
                        required
                        disabled={loading}
                        aria-describedby="password-error"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Signing Up...
                        </>
                      ) : (
                        'Sign Up'
                      )}
                    </Button>
                  </motion.div>
                </motion.form>

                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="text-green-600 hover:text-green-700 font-semibold transition-colors duration-200"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

  
      <AnimatePresence>
        {showPendingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowPendingModal(false)}
            role="dialog"
            aria-labelledby="pending-modal-title"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <button
                  onClick={() => setShowPendingModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-6 w-6" />
                </button>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', duration: 0.6 }}
                  className="mx-auto w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6"
                >
                  <Clock className="w-10 h-10 text-amber-600" />
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  id="pending-modal-title"
                  className="text-2xl font-bold text-gray-900 mb-4"
                >
                  Account Pending Approval
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 mb-6 leading-relaxed"
                >
                  Your account registration has been submitted successfully! Our admin team is currently reviewing your application.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gray-50 rounded-xl p-4 mb-6"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Registration completed</span>
                  </div>
                  <div className="flex items-center space-x-3 mt-2">
                    <div className="w-5 h-5 rounded-full border-2 border-amber-300 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                    </div>
                    <span className="text-sm text-gray-700">Admin review in progress</span>
                  </div>
                  <div className="flex items-center space-x-3 mt-2">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                    <span className="text-sm text-gray-400">Account activation</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
                >
                  <p className="text-sm text-blue-800">
                    <strong>Please wait for approval.</strong> This process typically takes 1-2 business days. Try login to check status.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button
                    onClick={() => setShowPendingModal(false)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Got it, thanks!
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Signup;
*/

/*
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sendOTP, signup } from '../../api/authAPI';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, User, Lock, Shield, Building, Users, Briefcase, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Department {
  _id: string;
  name: string;
}

interface Organization {
  _id: string;
  name: string;
  departments: Department[];
}

interface OrganizationResponse {
  success: boolean;
  statusCode: number;
  status: string;
  message: string;
  data: Organization[];
  timestamp: string;
}

const Signup = () => {
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [organizationsLoading, setOrganizationsLoading] = useState(true);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setOrganizationsLoading(true);
        const response = await fetch('http://localhost:5000/api/v1/org');
        const data: OrganizationResponse = await response.json();
        
        if (data.success) {
          setOrganizations(data.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch organizations",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch organizations. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setOrganizationsLoading(false);
      }
    };

    fetchOrganizations();
  }, [toast]);

  const getSelectedOrgDepartments = (): Department[] => {
    const selectedOrg = organizations.find(org => org._id === selectedOrganization);
    return selectedOrg?.departments || [];
  };

  const handleOrganizationChange = (orgId: string) => {
    setSelectedOrganization(orgId);
    setSelectedDepartment('');
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !password || !jobTitle || !selectedOrganization || !selectedDepartment) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await sendOTP(email);
      setStep('otp');
      toast({
        title: "OTP Sent",
        description: "Please check your email for the verification code",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      toast({
        title: "Error",
        description: "Please enter the OTP",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const signupData = {
        email,
        password,
        name,
        accountType: "employee",
        organization: selectedOrganization,
        department: selectedDepartment,
        jobTitle,
        otp
      };

      await signup(signupData);
      toast({
        title: "Success",
        description: "Account created successfully! Please login.",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please check your OTP and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-lg overflow-hidden rounded-2xl">
          <div className="flex flex-col lg:flex-row">
            
            <div className="hidden lg:block lg:w-2/5 bg-gradient-to-br from-green-600 to-emerald-700 p-12 text-white">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <img 
                    src="lovable-uploads/0323b2d6-af36-4b5d-88d0-c2dd4bbd9e2e.png" 
                    alt="Workcultur Logo" 
                    className="h-14 w-auto mb-8"
                  />
                  <h2 className="text-3xl font-bold mb-4">Welcome to Workcultur</h2>
                  <p className="text-green-100">
                    Join our platform to connect with your organization and streamline your workflow.
                  </p>
                </div>
                <div className="mt-8">
                  <p className="text-sm text-green-200">Trusted by thousands of professionals worldwide</p>
                </div>
              </div>
            </div>

            
            <div className="w-full lg:w-3/5 p-6 sm:p-8 lg:p-12">
              <div className="max-w-md mx-auto">
                
                <div className="lg:hidden text-center mb-8">
                  <img 
                    src="/lovable-Uploads/0323b2d6-af36-4b5d-88d0-c2dd4bbd9e2e.png" 
                    alt="Workcultur Logo" 
                    className="h-12 w-auto mx-auto mb-4"
                  />
                </div>

               
                <div className="flex justify-center mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'details' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                        {step === 'otp' ? <CheckCircle2 className="h-5 w-5" /> : '1'}
                      </div>
                      <span className="text-xs mt-2 text-gray-600">Details</span>
                    </div>
                    <div className="w-12 h-1 bg-gray-200 rounded-full">
                      <div className={`h-full rounded-full ${step === 'otp' ? 'bg-green-500 w-full' : 'bg-gray-200 w-0'}`}></div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'otp' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                        2
                      </div>
                      <span className="text-xs mt-2 text-gray-600">Verify</span>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {step === 'details' ? 'Create Your Account' : 'Verify Your Email'}
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {step === 'details' ? 'Enter your details to get started' : 'Enter the verification code sent to your email'}
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {step === 'details' ? (
                    <motion.form
                      key="details"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleSendOTP}
                      className="space-y-6"
                    >
                      
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Personal Information
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <motion.div 
                            className="space-y-2"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 rounded-lg"
                                required
                              />
                            </div>
                          </motion.div>

                          <motion.div 
                            className="space-y-2"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="email"
                                type="email"
                                placeholder="john@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 rounded-lg"
                                required
                              />
                            </div>
                          </motion.div>

                          <motion.div 
                            className="space-y-2"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="password"
                                type="password"
                                placeholder="Create password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 rounded-lg"
                                required
                              />
                            </div>
                          </motion.div>

                          <motion.div 
                            className="space-y-2"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">Job Title</Label>
                            <div className="relative">
                              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="jobTitle"
                                type="text"
                                placeholder="Software Engineer"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 rounded-lg"
                                required
                              />
                            </div>
                          </motion.div>
                        </div>
                      </div>


                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Organization Details
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <motion.div 
                            className="space-y-2"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Label htmlFor="organization" className="text-sm font-medium text-gray-700">Organization</Label>
                            <div className="relative">
                              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                              <Select 
                                value={selectedOrganization} 
                                onValueChange={handleOrganizationChange}
                                disabled={organizationsLoading}
                              >
                                <SelectTrigger className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 rounded-lg">
                                  <SelectValue placeholder={organizationsLoading ? "Loading..." : "Select organization"} />
                                </SelectTrigger>
                                <SelectContent>
                                  {organizations.map((org) => (
                                    <SelectItem key={org._id} value={org._id}>
                                      {org.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </motion.div>

                          <motion.div 
                            className="space-y-2"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Label htmlFor="department" className="text-sm font-medium text-gray-700">Department</Label>
                            <div className="relative">
                              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                              <Select 
                                value={selectedDepartment} 
                                onValueChange={setSelectedDepartment}
                                disabled={!selectedOrganization || getSelectedOrgDepartments().length === 0}
                              >
                                <SelectTrigger className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 rounded-lg">
                                  <SelectValue placeholder={
                                    !selectedOrganization 
                                      ? "Select organization first" 
                                      : getSelectedOrgDepartments().length === 0
                                      ? "No departments"
                                      : "Select department"
                                  } />
                                </SelectTrigger>
                                <SelectContent>
                                  {getSelectedOrgDepartments().map((dept) => (
                                    <SelectItem key={dept._id} value={dept._id}>
                                      {dept.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </motion.div>
                        </div>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button 
                          type="submit" 
                          className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl" 
                          disabled={loading || organizationsLoading}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Sending OTP...
                            </>
                          ) : (
                            'Send Verification Code'
                          )}
                        </Button>
                      </motion.div>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="otp"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleSignup}
                      className="space-y-6"
                    >
                      <motion.div 
                        className="text-center p-6 bg-green-50 rounded-lg border border-green-200"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Shield className="mx-auto h-12 w-12 text-green-600 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify Your Email</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          We've sent a 6-digit verification code to
                        </p>
                        <p className="font-medium text-green-600 break-all">{email}</p>
                      </motion.div>

                      <motion.div 
                        className="space-y-2"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Label htmlFor="otp" className="text-sm font-medium text-gray-700">Verification Code</Label>
                        <Input
                          id="otp"
                          type="text"
                          placeholder="Enter 6-digit code"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="text-center text-lg tracking-widest h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 rounded-lg"
                          maxLength={6}
                          required
                        />
                      </motion.div>

                      <div className="space-y-3">
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Button 
                            type="submit" 
                            className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl" 
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Creating Account...
                              </>
                            ) : (
                              'Create Account'
                            )}
                          </Button>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="w-full h-12 border-gray-200 hover:bg-gray-50 rounded-lg transition-all duration-200" 
                            onClick={() => setStep('details')}
                          >
                            Back to Details
                          </Button>
                        </motion.div>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold transition-colors duration-200">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;
*/

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sendOTP, signup } from '../../api/authAPI';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, User, Lock, Shield, Building, Users, Briefcase, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Background from '@/components/ui/background';

// Import logo as a module
import Logo from '/lovable-uploads/0323b2d6-af36-4b5d-88d0-c2dd4bbd9e2e.png';

interface Department {
  _id: string;
  name: string;
}

interface Organization {
  _id: string;
  name: string;
  departments: Department[];
}

interface OrganizationResponse {
  success: boolean;
  statusCode: number;
  status: string;
  message: string;
  data: Organization[];
  timestamp: string;
}

const Signup = () => {
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [organizationsLoading, setOrganizationsLoading] = useState(true);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setOrganizationsLoading(true);
        const response = await fetch('https://wc-backend.zetrance.com/api/v1/org');
        const data: OrganizationResponse = await response.json();
        
        if (data.success) {
          setOrganizations(data.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch organizations",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch organizations. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setOrganizationsLoading(false);
      }
    };

    fetchOrganizations();
  }, [toast]);

  const getSelectedOrgDepartments = (): Department[] => {
    const selectedOrg = organizations.find(org => org._id === selectedOrganization);
    return selectedOrg?.departments || [];
  };

  const handleOrganizationChange = (orgId: string) => {
    setSelectedOrganization(orgId);
    setSelectedDepartment('');
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !password || !jobTitle || !selectedOrganization || !selectedDepartment) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await sendOTP(email);
      setStep('otp');
      toast({
        title: "OTP Sent",
        description: "Please check your email for the verification code",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      toast({
        title: "Error",
        description: "Please enter the OTP",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const signupData = {
        email,
        password,
        name,
        accountType: "employee",
        organization: selectedOrganization,
        department: selectedDepartment,
        jobTitle,
        otp
      };

      await signup(signupData);
      toast({
        title: "Success",
        description: "Account created successfully! Please login.",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please check your OTP and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background component */}
      <Background className="absolute inset-0 z-0" />

      {/* Centered form card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl z-10"
      >
        {/*
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-lg overflow-hidden rounded-2xl">
          <div className="flex flex-col lg:flex-row">
            
            <div className="hidden lg:block lg:w-2/5 bg-gradient-to-br from-green-600 to-emerald-700 p-12 text-white">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <img 
                    src={Logo} 
                    alt="Workcultur Logo" 
                    className="h-14 w-auto mb-8"
                  />
                  <h2 className="text-3xl font-bold mb-4">Welcome to Workcultur</h2>
                  <p className="text-green-100">
                    Join our platform to connect with your organization and streamline your workflow.
                  </p>
                </div>
                <div className="mt-8">
                  <p className="text-sm text-green-200">Trusted by thousands of professionals worldwide</p>
                </div>
              </div>
            </div>


            <div className="w-full lg:w-3/5 p-6 sm:p-8 lg:p-12">
              <div className="max-w-md mx-auto">

                <div className="lg:hidden text-center mb-8">
                  <img 
                    src={Logo} 
                    alt="Workcultur Logo" 
                    className="h-12 w-auto mx-auto mb-4"
                  />
                </div>


                <div className="flex justify-center mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'details' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                        {step === 'otp' ? <CheckCircle2 className="h-5 w-5" /> : '1'}
                      </div>
                      <span className="text-xs mt-2 text-gray-600">Details</span>
                    </div>
                    <div className="w-12 h-1 bg-gray-200 rounded-full">
                      <div className={`h-full rounded-full ${step === 'otp' ? 'bg-green-500 w-full' : 'bg-gray-200 w-0'}`}></div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'otp' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                        2
                      </div>
                      <span className="text-xs mt-2 text-gray-600">Verify</span>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {step === 'details' ? 'Create Your Account' : 'Verify Your Email'}
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {step === 'details' ? 'Enter your details to get started' : 'Enter the verification code sent to your email'}
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {step === 'details' ? (
                    <motion.form
                      key="details"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleSendOTP}
                      className="space-y-6"
                    >
                     
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Personal Information
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <motion.div 
                            className="space-y-2"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 rounded-lg"
                                required
                              />
                            </div>
                          </motion.div>

                          <motion.div 
                            className="space-y-2"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="email"
                                type="email"
                                placeholder="john@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 rounded-lg"
                                required
                              />
                            </div>
                          </motion.div>

                          <motion.div 
                            className="space-y-2"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="password"
                                type="password"
                                placeholder="Create password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 rounded-lg"
                                required
                              />
                            </div>
                          </motion.div>

                          <motion.div 
                            className="space-y-2"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">Job Title</Label>
                            <div className="relative">
                              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="jobTitle"
                                type="text"
                                placeholder="Software Engineer"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 rounded-lg"
                                required
                              />
                            </div>
                          </motion.div>
                        </div>
                      </div>

                   
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Organization Details
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <motion.div 
                            className="space-y-2"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Label htmlFor="organization" className="text-sm font-medium text-gray-700">Organization</Label>
                            <div className="relative">
                              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                              <Select 
                                value={selectedOrganization} 
                                onValueChange={handleOrganizationChange}
                                disabled={organizationsLoading}
                              >
                                <SelectTrigger className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 rounded-lg">
                                  <SelectValue placeholder={organizationsLoading ? "Loading..." : "Select organization"} />
                                </SelectTrigger>
                                <SelectContent>
                                  {organizations.map((org) => (
                                    <SelectItem key={org._id} value={org._id}>
                                      {org.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </motion.div>

                          <motion.div 
                            className="space-y-2"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Label htmlFor="department" className="text-sm font-medium text-gray-700">Department</Label>
                            <div className="relative">
                              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                              <Select 
                                value={selectedDepartment} 
                                onValueChange={setSelectedDepartment}
                                disabled={!selectedOrganization || getSelectedOrgDepartments().length === 0}
                              >
                                <SelectTrigger className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 rounded-lg">
                                  <SelectValue placeholder={
                                    !selectedOrganization 
                                      ? "Select organization first" 
                                      : getSelectedOrgDepartments().length === 0
                                      ? "No departments"
                                      : "Select department"
                                  } />
                                </SelectTrigger>
                                <SelectContent>
                                  {getSelectedOrgDepartments().map((dept) => (
                                    <SelectItem key={dept._id} value={dept._id}>
                                      {dept.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </motion.div>
                        </div>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button 
                          type="submit" 
                          className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl" 
                          disabled={loading || organizationsLoading}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Sending OTP...
                            </>
                          ) : (
                            'Send Verification Code'
                          )}
                        </Button>
                      </motion.div>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="otp"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleSignup}
                      className="space-y-6"
                    >
                      <motion.div 
                        className="text-center p-6 bg-green-50 rounded-lg border border-green-200"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Shield className="mx-auto h-12 w-12 text-green-600 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify Your Email</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          We've sent a 6-digit verification code to
                        </p>
                        <p className="font-medium text-green-600 break-all">{email}</p>
                      </motion.div>

                      <motion.div 
                        className="space-y-2"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Label htmlFor="otp" className="text-sm font-medium text-gray-700">Verification Code</Label>
                        <Input
                          id="otp"
                          type="text"
                          placeholder="Enter 6-digit code"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="text-center text-lg tracking-widest h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 rounded-lg"
                          maxLength={6}
                          required
                        />
                      </motion.div>

                      <div className="space-y-3">
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Button 
                            type="submit" 
                            className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl" 
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Creating Account...
                              </>
                            ) : (
                              'Create Account'
                            )}
                          </Button>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="w-full h-12 border-gray-200 hover:bg-gray-50 rounded-lg transition-all duration-200" 
                            onClick={() => setStep('details')}
                          >
                            Back to Details
                          </Button>
                        </motion.div>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold transition-colors duration-200">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
        */}

        <Card className="bg-white/2 backdrop-blur-sm border border-white/10 rounded-2xl text-white shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-300 overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Left Side - Branding (Hidden on mobile) */}
              <div className="hidden lg:block lg:w-2/5 bg-white/5 backdrop-blur-sm border-r border-white/10 p-12 text-white shadow-inner">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <img src={Logo} alt="Workcultur Logo" className="h-20 w-auto mb-8" />
                    <h2 className="text-3xl font-bold mb-4">Welcome to Workcultur</h2>
                    <p className="text-gray-300">Join our platform to connect with your organization and streamline your workflow.</p>
                  </div>
                  <div className="mt-8">
                    <p className="text-sm text-gray-400">Trusted by thousands of professionals worldwide</p>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="w-full lg:w-3/5 p-6 sm:p-8 lg:p-12">
                <div className="max-w-md mx-auto">
                  {/* Mobile Logo */}
                  <div className="lg:hidden text-center mb-8">
                    <img src={Logo} alt="Workcultur Logo" className="h-12 w-auto mx-auto mb-4" />
                  </div>

                  {/* Progress Indicator */}
                  {/* You can keep your existing progress code here unchanged */}

                  {/* Title & Description */}
                  <div className="text-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      {step === 'details' ? 'Create Your Account' : 'Verify Your Email'}
                    </h2>
                    <p className="text-sm font-medium text-gray-300">
                      {step === 'details'
                        ? 'Enter your details to get started'
                        : 'Enter the verification code sent to your email'}
                    </p>
                  </div>

                  {/* Form Sections */}
                  <AnimatePresence mode="wait">
                    {step === 'details' ? (
                      <motion.form
                        key="details"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={handleSendOTP}
                        className="space-y-6"
                      >
                        {/* Personal Information Section */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Personal Information</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Full Name */}
                            <motion.div className="space-y-2" whileHover={{ scale: 1.01 }}>
                              <Label htmlFor="name" className="text-sm font-medium text-white">Full Name</Label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  id="name"
                                  type="text"
                                  placeholder="John Doe"
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  className="pl-10 h-12 border border-white/20 bg-white/10 text-white placeholder:text-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg"
                                  required
                                />
                              </div>
                            </motion.div>

                            {/* Email */}
                            <motion.div className="space-y-2" whileHover={{ scale: 1.01 }}>
                              <Label htmlFor="email" className="text-sm font-medium text-white">Email Address</Label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  id="email"
                                  type="email"
                                  placeholder="john@company.com"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="pl-10 h-12 border border-white/20 bg-white/10 text-white placeholder:text-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg"
                                  required
                                />
                              </div>
                            </motion.div>

                            {/* Password */}
                            <motion.div className="space-y-2" whileHover={{ scale: 1.01 }}>
                              <Label htmlFor="password" className="text-sm font-medium text-white">Password</Label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  id="password"
                                  type="password"
                                  placeholder="Create password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  className="pl-10 h-12 border border-white/20 bg-white/10 text-white placeholder:text-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg"
                                  required
                                />
                              </div>
                            </motion.div>

                            {/* Job Title */}
                            <motion.div className="space-y-2" whileHover={{ scale: 1.01 }}>
                              <Label htmlFor="jobTitle" className="text-sm font-medium text-white">Job Title</Label>
                              <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  id="jobTitle"
                                  type="text"
                                  placeholder="Software Engineer"
                                  value={jobTitle}
                                  onChange={(e) => setJobTitle(e.target.value)}
                                  className="pl-10 h-12 border border-white/20 bg-white/10 text-white placeholder:text-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg"
                                  required
                                />
                              </div>
                            </motion.div>
                          </div>
                        </div>

                        {/* Organization Details */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Organization Details</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Organization */}
                            <motion.div className="space-y-2" whileHover={{ scale: 1.01 }}>
                              <Label htmlFor="organization" className="text-sm font-medium text-white">Organization</Label>
                              <div className="relative">
                                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                                <Select value={selectedOrganization} onValueChange={handleOrganizationChange}>
                                  <SelectTrigger className="pl-10 h-12 border border-white/20 bg-white/10 text-white placeholder:text-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg">
                                    <SelectValue placeholder={organizationsLoading ? "Loading..." : "Select organization"} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {organizations.map((org) => (
                                      <SelectItem key={org._id} value={org._id}>{org.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </motion.div>

                            {/* Department */}
                            <motion.div className="space-y-2" whileHover={{ scale: 1.01 }}>
                              <Label htmlFor="department" className="text-sm font-medium text-white">Department</Label>
                              <div className="relative">
                                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                                  <SelectTrigger className="pl-10 h-12 border border-white/20 bg-white/10 text-white placeholder:text-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg">
                                    <SelectValue
                                      placeholder={
                                        !selectedOrganization
                                          ? "Select organization first"
                                          : getSelectedOrgDepartments().length === 0
                                          ? "No departments"
                                          : "Select department"
                                      }
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getSelectedOrgDepartments().map((dept) => (
                                      <SelectItem key={dept._id} value={dept._id}>{dept.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </motion.div>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            type="submit"
                            className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Sending OTP...
                              </>
                            ) : (
                              'Send Verification Code'
                            )}
                          </Button>
                        </motion.div>
                      </motion.form>
                    ) : (
                      <motion.form /* OTP form */> {/* You can apply same styles to OTP section inputs here */}</motion.form>
                    )}
                  </AnimatePresence>

                  <div className="mt-8 text-center">
                    <p className="text-sm text-gray-300">
                      Already have an account?{' '}
                      <Link to="/login" className="text-green-400 hover:text-green-300 font-semibold transition-colors duration-200">
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>


      </motion.div>
    </div>
  );
};

export default Signup;