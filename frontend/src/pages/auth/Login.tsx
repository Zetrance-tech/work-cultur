/*
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { login } from '../../api/authAPI';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { ShootingStars } from '@/components/ui/shooting-stars';
import { ElegantShape } from '@/components/ui/elegant-shape';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await login(email, password);
      console.log("Login response:", response.data);
      authLogin(response.data);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white">
      
      <ShootingStars />

      
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-indigo-500/[0.15]"
          className="left-[-10%] top-[15%]"
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-rose-500/[0.15]"
          className="right-[-5%] top-[75%]"
        />
        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-violet-500/[0.15]"
          className="left-[5%] bottom-[10%]"
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
                    src="lovable-uploads/0323b2d6-af36-4b5d-88d0-c2dd4bbd9e2e.png"
                    alt="Workcultur Logo"
                    className="h-14 w-auto mb-8"
                  />
                  <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
                  <p className="text-green-100">
                    Sign in to access your personalized dashboard.
                  </p>
                </div>
                <div className="mt-8">
                  <p className="text-sm text-green-200">
                    Trusted by thousands of professionals worldwide
                  </p>
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

                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Enter your credentials to access your account
                  </p>
                </div>

                <motion.form
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleLogin}
                  className="space-y-6"
                >
                  <motion.div
                    className="space-y-2"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12"
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-12"
                        required
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
                          Signing In...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </motion.div>
                </motion.form>

                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-green-600 hover:text-green-700 font-semibold">
                      Sign up here
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

export default Login;
*/

/*
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { login } from '../../api/authAPI';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { ShootingStars } from '@/components/ui/shooting-stars';
import { ElegantShape } from '@/components/ui/elegant-shape';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
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
      const response = await login(email, password);
      console.log('Login response:', response.data);
      authLogin(response.data);
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white">
      
      <div className="absolute inset-0 z-0 overflow-hidden">
        <ShootingStars />

         <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-indigo-500/[0.3]"
          className="right-[5%] md:right-[10%] top-[5%] md:top-[8%]" // Top-right corner
        />
        
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-indigo-500/[0.3]"
          className="left-[-10%] top-[15%]"
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-rose-500/[0.3]"
          className="right-[-5%] top-[75%]"
        />
        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-violet-500/[0.3]"
          className="left-[5%] bottom-[10%]"
        />
        <ElegantShape
          delay={0.6}
          width={400}
          height={100}
          rotate={18}
          gradient="from-teal-500/[0.3]"
          className="right-[10%] md:right-[15%] top-[30%] md:top-[35%]"
        />
        <ElegantShape
          delay={0.8}
          width={250}
          height={70}
          rotate={-20}
          gradient="from-purple-500/[0.3]"
          className="left-[15%] md:left-[20%] top-[50%] md:top-[55%]"
        />
        <ElegantShape
          delay={0.7}
          width={350}
          height={90}
          rotate={10}
          gradient="from-blue-500/[0.3]"
          className="right-[5%] md:right-[10%] bottom-[15%] md:bottom-[20%]"
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
                    src="lovable-Uploads/0323b2d6-af36-4b5d-88d0-c2dd4bbd9e2e.png"
                    alt="Workcultur Logo"
                    className="h-14 w-auto mb-8"
                  />
                  <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
                  <p className="text-green-100">
                    Sign in to access your personalized dashboard.
                  </p>
                </div>
                <div className="mt-8">
                  <p className="text-sm text-green-200">
                    Trusted by thousands of professionals worldwide
                  </p>
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

                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Enter your credentials to access your account
                  </p>
                </div>

                <motion.form
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleLogin}
                  className="space-y-6"
                >
                  <motion.div
                    className="space-y-2"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12"
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-12"
                        required
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
                          Signing In...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </motion.div>
                </motion.form>

                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-green-600 hover:text-green-700 font-semibold">
                      Sign up here
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

export default Login;
*/


/*
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { login } from '../../api/authAPI';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, Clock, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShootingStars } from '@/components/ui/shooting-stars';
import { ElegantShape } from '@/components/ui/elegant-shape';

// Import logo as a module
import Logo from '/lovable-uploads/0323b2d6-af36-4b5d-88d0-c2dd4bbd9e2e.png';

// Define types for API response
interface LoginResponse {
  ok: boolean;
  status: number;
  data?: { token: string; user: { id: string; email: string } };
  message?: string;
}

const Login = () => {
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

  const handleLogin = async (e: React.FormEvent) => {
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
      const response: LoginResponse = await login(email, password);
      console.log('Login response:', response); // Debug log

      if (response.status === 403) {
        setShowPendingModal(true);
        return;
      }

      if (!response.ok) {
        toast({
          title: 'Login Failed',
          description: response.message || 'Invalid email or password. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      if (response.data) {
        authLogin(response.data);
        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in.',
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error); // Debug log
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      toast({
        title: 'Login Failed',
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
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <ShootingStars />
          <ElegantShape
            delay={0.3}
            width={600}
            height={140}
            rotate={12}
            gradient="from-indigo-500/[0.4]"
            className="right-[5%] md:right-[10%] top-[5%] md:top-[8%]" // Top-right corner
          />
          <ElegantShape
            delay={0.5}
            width={500}
            height={120}
            rotate={-15}
            gradient="from-rose-500/[0.4]"
            className="left-1/2 transform -translate-x-1/2 top-[5%] md:top-[10%]" // Top-middle
          />
          <ElegantShape
            delay={0.4}
            width={300}
            height={80}
            rotate={-8}
            gradient="from-violet-500/[0.4]"
            className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[8%]" // Bottom-left corner
          />
          <ElegantShape
            delay={0.6}
            width={400}
            height={100}
            rotate={18}
            gradient="from-teal-500/[0.4]"
            className="left-[5%] md:left-[10%] top-[25%] md:top-[30%]" // Left-middle
          />
          <ElegantShape
            delay={0.8}
            width={250}
            height={70}
            rotate={-20}
            gradient="from-purple-500/[0.4]"
            className="right-[5%] md:right-[10%] bottom-[25%] md:bottom-[30%]" // Bottom-right
          />
          <ElegantShape
            delay={0.7}
            width={350}
            height={90}
            rotate={10}
            gradient="from-blue-500/[0.4]"
            className="left-1/2 transform -translate-x-1/2 bottom-[15%] md:bottom-[20%]" // Bottom-middle
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl z-10"
        >
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-lg overflow-hidden rounded-2xl">
            <div className="flex flex-col lg:flex-row">
              
              <div className="hidden lg:block lg:w-2/5 bg-gradient-to-br from-green-600 to-emerald-700 p-12 text-white">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <img src={Logo} alt="Workcultur Logo" className="h-14 w-auto mb-8" />
                    <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
                    <p className="text-green-100">Sign in to access your personalized dashboard.</p>
                  </div>
                  <div className="mt-8">
                    <p className="text-sm text-green-200">Trusted by thousands of professionals worldwide</p>
                  </div>
                </div>
              </div>

              
              <div className="w-full lg:w-3/5 p-6 sm:p-8 lg:p-12">
                <div className="max-w-md mx-auto">
                  
                  <div className="lg:hidden text-center mb-8">
                    <img src={Logo} alt="Workcultur Logo" className="h-12 w-auto mx-auto mb-4" />
                  </div>

                  <div className="text-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Enter your credentials to access your account
                    </p>
                  </div>

                  <motion.form
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleLogin}
                    className="space-y-6"
                    aria-label="Login form"
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
                            Signing In...
                          </>
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </motion.div>
                  </motion.form>

                  <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                      Don't have an account?{' '}
                      <Link
                        to="/signup"
                        className="text-green-600 hover:text-green-700 font-semibold transition-colors duration-200"
                      >
                        Sign up here
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      
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
                    <div className="w-5 h-5 rounded-full border-2 border-amber-300 flex-shrink-0">
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
    </>
  );
};

export default Login;
*/


import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { login } from '../../api/authAPI';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, Clock, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Background from '@/components/ui/background';

// Import logo as a module
import Logo from '/lovable-uploads/0323b2d6-af36-4b5d-88d0-c2dd4bbd9e2e.png';

// Define types for API response
interface LoginResponse {
  success: boolean;
  statusCode: number;
  status: string;
  data?: { token: string; user: { id: string; email: string } };
  message?: string;
}

const Login = () => {
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

  const handleLogin = async (e: React.FormEvent) => {
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
      const response: LoginResponse = await login(email, password);
      console.log('Login response:', response);

      if (response.statusCode === 403) {
        setShowPendingModal(true);
        return;
      }

      if (!response.success) {
        toast({
          title: 'Login Failed',
          description: response.message || 'Invalid email or password. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      if (response.data) {
        try {
          
          localStorage.setItem("workcultur_token", response.data.token); 
          authLogin(response.data);
          toast({
            title: 'Welcome back!',
            description: 'You have successfully logged in.',
          });
          navigate('/homepage');
        } catch (authError) {
          console.error('authLogin error:', authError);
          toast({
            title: 'Login Failed',
            description: 'Error updating authentication state. Please try again.',
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Login Failed',
          description: 'No user data received. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      toast({
        title: 'Login Failed',
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
     
        <Card className="bg-white/2 backdrop-blur-sm border border-white/10 rounded-2xl text-white shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-300 overflow-hidden">


          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Branding 
            <div className="hidden lg:block lg:w-2/5 bg-gradient-to-br from-green-600 to-emerald-700 p-12 text-white">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <img src={Logo} alt="Workcultur Logo" className="h-14 w-auto mb-8" />
                  <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
                  <p className="text-green-100">Sign in to access your personalized dashboard.</p>
                </div>
                <div className="mt-8">
                  <p className="text-sm text-green-200">Trusted by thousands of professionals worldwide</p>
                </div>
              </div>
            </div>
            */}
            <div className="hidden lg:block lg:w-2/5 bg-white/5 backdrop-blur-sm border-r border-white/10 p-12 text-white shadow-inner">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <img src={Logo} alt="Workcultur Logo" className="h-22 w-auto mb-8" />
                  <h2 className="text-3xl font-bold mb-4 text-white drop-shadow-md">Welcome Back</h2>
                  <p className="text-sm text-gray-300">Sign in to access your personalized dashboard.</p>
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

                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white-900 mb-2" >Sign In</h2>
                  <p /*className="text-gray-600 text-sm sm:text-base"*/ className="text-sm font-medium text-white">
                    Enter your credentials to access your account
                  </p>
                </div>

                <motion.form
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleLogin}
                  className="space-y-6"
                  aria-label="Login form"
                >
                  <motion.div
                    className="space-y-2"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Label htmlFor="email" /*className="text-sm font-medium text-gray-700"*/  className="text-sm font-medium text-white">
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
                        /*className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 rounded-lg"*/
                        className="pl-10 h-12 border border-white/20 bg-white/10 text-white placeholder:text-gray-300 focus:ring-green-500 focus:border-green-500 transition-all duration-200 rounded-lg"

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
                    <Label htmlFor="password" /*className="text-sm font-medium text-gray-700"*/  className="text-sm font-medium text-white">
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
                        /*className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 rounded-lg"*/
                          className="pl-10 h-12 border border-white/20 bg-white/10 text-white placeholder:text-gray-300 focus:ring-green-500 focus:border-green-500 transition-all duration-200 rounded-lg"

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
                          Signing In...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </motion.div>
                </motion.form>

                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link
                      to="/signup"
                      className="text-green-600 hover:text-green-700 font-semibold transition-colors duration-200"
                    >
                      Sign up here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Pending Approval Modal */}
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
                    <div className="w-5 h-5 rounded-full border-2 border-amber-300 flex-shrink-0">
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

export default Login;