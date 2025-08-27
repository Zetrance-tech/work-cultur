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

