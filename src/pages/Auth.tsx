
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Utensils, Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { loginSchema, signupSchema, type LoginFormData, type SignupFormData } from "@/lib/validation";
import { authRateLimiter } from "@/lib/rateLimiter";
import { handleSecureError, createSecureError, sanitizeInput } from "@/lib/errorHandler";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState<SignupFormData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const [loginErrors, setLoginErrors] = useState<Partial<LoginFormData>>({});
  const [signupErrors, setSignupErrors] = useState<Partial<SignupFormData>>({});

  const validateAndSanitizeLoginData = (data: LoginFormData): LoginFormData => {
    const result = loginSchema.safeParse(data);
    if (!result.success) {
      const errors: Partial<LoginFormData> = {};
      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof LoginFormData;
        errors[field] = error.message;
      });
      setLoginErrors(errors);
      throw createSecureError(
        "Please check your input and try again",
        `Login validation failed: ${result.error.message}`,
        'LOGIN_VALIDATION_ERROR'
      );
    }
    
    return {
      email: sanitizeInput(result.data.email),
      password: result.data.password, // Don't sanitize passwords
    };
  };

  const validateAndSanitizeSignupData = (data: SignupFormData): SignupFormData => {
    const result = signupSchema.safeParse(data);
    if (!result.success) {
      const errors: Partial<SignupFormData> = {};
      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof SignupFormData;
        errors[field] = error.message;
      });
      setSignupErrors(errors);
      throw createSecureError(
        "Please check your input and try again",
        `Signup validation failed: ${result.error.message}`,
        'SIGNUP_VALIDATION_ERROR'
      );
    }
    
    return {
      email: sanitizeInput(result.data.email),
      password: result.data.password, // Don't sanitize passwords
      firstName: sanitizeInput(result.data.firstName),
      lastName: sanitizeInput(result.data.lastName),
    };
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginErrors({});

    try {
      // Rate limiting check
      const clientId = `login_${loginData.email || 'unknown'}`;
      if (!authRateLimiter.isAllowed(clientId)) {
        throw createSecureError(
          "Too many login attempts. Please wait a moment before trying again.",
          `Rate limit exceeded for login attempts: ${clientId}`,
          'RATE_LIMIT_EXCEEDED'
        );
      }

      // Validate and sanitize input
      const sanitizedData = validateAndSanitizeLoginData(loginData);

      const { error } = await signIn(sanitizedData.email, sanitizedData.password);
      
      if (error) {
        throw createSecureError(
          "Invalid email or password. Please try again.",
          `Login failed: ${error.message}`,
          'LOGIN_FAILED'
        );
      } else {
        toast({
          title: "Welcome back! 🥩",
          description: "Successfully logged in to CarniTrack",
        });
        navigate("/");
      }
    } catch (error) {
      handleSecureError(error, toast);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSignupErrors({});

    try {
      // Rate limiting check
      const clientId = `signup_${signupData.email || 'unknown'}`;
      if (!authRateLimiter.isAllowed(clientId)) {
        throw createSecureError(
          "Too many signup attempts. Please wait a moment before trying again.",
          `Rate limit exceeded for signup attempts: ${clientId}`,
          'RATE_LIMIT_EXCEEDED'
        );
      }

      // Validate and sanitize input
      const sanitizedData = validateAndSanitizeSignupData(signupData);

      const { error } = await signUp(
        sanitizedData.email,
        sanitizedData.password,
        sanitizedData.firstName,
        sanitizedData.lastName
      );
      
      if (error) {
        throw createSecureError(
          "Unable to create account. Please try again.",
          `Signup failed: ${error.message}`,
          'SIGNUP_FAILED'
        );
      } else {
        toast({
          title: "Welcome to CarniTrack! 🥩",
          description: "Account created successfully",
        });
        navigate("/");
      }
    } catch (error) {
      handleSecureError(error, toast);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url('/lovable-uploads/6b70bb5d-03bb-455f-8625-b980c27f3853.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 p-3 rounded-full shadow-lg">
              <Utensils className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">CarniTrack</h1>
              <p className="text-orange-200 text-sm drop-shadow">Your Carnivore Lifestyle Companion</p>
            </div>
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-md shadow-2xl border-0">
          <CardHeader>
            <CardTitle className="text-center text-red-800">
              Get Started
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                      />
                    </div>
                    {loginErrors.email && <p className="text-sm text-red-600">{loginErrors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                    </div>
                    {loginErrors.password && <p className="text-sm text-red-600">{loginErrors.password}</p>}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-red-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-firstName"
                          type="text"
                          placeholder="First name"
                          className="pl-10"
                          value={signupData.firstName}
                          onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                        />
                      </div>
                      {signupErrors.firstName && <p className="text-sm text-red-600">{signupErrors.firstName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-lastName">Last Name</Label>
                      <Input
                        id="signup-lastName"
                        type="text"
                        placeholder="Last name"
                        value={signupData.lastName}
                        onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                      />
                      {signupErrors.lastName && <p className="text-sm text-red-600">{signupErrors.lastName}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        required
                      />
                    </div>
                    {signupErrors.email && <p className="text-sm text-red-600">{signupErrors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        className="pl-10"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        required
                      />
                    </div>
                    {signupErrors.password && <p className="text-sm text-red-600">{signupErrors.password}</p>}
                    <p className="text-xs text-gray-600">Password must be at least 8 characters with uppercase, lowercase, and number</p>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-red-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Sign Up"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
