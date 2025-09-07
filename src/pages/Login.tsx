import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db, auth } from "@/lib/firebase";
import { ref, push, set, update } from "firebase/database";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [signupForm, setSignupForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password);
      const timestamp = Date.now();
      const loginLogRef = ref(db, `auth/logins`);
      await set(push(loginLogRef), {
        uid: cred.user.uid,
        email: cred.user.email,
        timestamp
      });

      toast({
        title: "Login Successful!",
        description: "Welcome back to LUXE Fashion.",
      });

      // If this user is the admin account, route to admin
      if (cred.user.email === "admin@luxe.com") {
        window.location.href = "/admin";
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error?.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupForm.password !== signupForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Please ensure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, signupForm.email, signupForm.password);
      await updateProfile(cred.user, {
        displayName: `${signupForm.firstName} ${signupForm.lastName}`.trim()
      });
      await set(push(ref(db, `auth/users`)), {
        uid: cred.user.uid,
        email: cred.user.email,
        firstName: signupForm.firstName,
        lastName: signupForm.lastName,
        createdAt: new Date().toISOString()
      });
      toast({
        title: "Account Created!",
        description: "Welcome to LUXE Fashion.",
      });
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block mb-6">
            <div className="text-4xl font-bold text-luxury-gold">LUXE</div>
          </Link>
          <h2 className="text-luxury-subheading">
            Welcome Back
          </h2>
          <p className="mt-2 text-muted-foreground">
            Access your luxury fashion account
          </p>
        </div>

        {/* Login/Signup Tabs */}
        <Card className="card-luxury">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="text-sm font-medium">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-sm font-medium">
                Create Account
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">Sign in to your account</CardTitle>
                <CardDescription>
                  Continue your luxury shopping experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <Label htmlFor="login-email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        required
                        className="pl-10 input-luxury"
                        placeholder="your@email.com"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="login-password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="pl-10 pr-10 input-luxury"
                        placeholder="Enter your password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-muted-foreground">Remember me</span>
                    </label>
                    <Link to="/forgot-password" className="text-sm text-luxury-gold hover:text-luxury-gold-light">
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-luxury"
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">Create your account</CardTitle>
                <CardDescription>
                  Join the LUXE Fashion community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first-name" className="text-sm font-medium">
                        First Name
                      </Label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="first-name"
                          type="text"
                          required
                          className="pl-10 input-luxury"
                          placeholder="First name"
                          value={signupForm.firstName}
                          onChange={(e) => setSignupForm({...signupForm, firstName: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="last-name" className="text-sm font-medium">
                        Last Name
                      </Label>
                      <Input
                        id="last-name"
                        type="text"
                        required
                        className="input-luxury"
                        placeholder="Last name"
                        value={signupForm.lastName}
                        onChange={(e) => setSignupForm({...signupForm, lastName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        required
                        className="pl-10 input-luxury"
                        placeholder="your@email.com"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="pl-10 input-luxury"
                        placeholder="Create a password"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirm-password" className="text-sm font-medium">
                      Confirm Password
                    </Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="pl-10 input-luxury"
                        placeholder="Confirm your password"
                        value={signupForm.confirmPassword}
                        onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <label className="flex items-start space-x-2 text-sm">
                      <input type="checkbox" required className="mt-1" />
                      <span className="text-muted-foreground">
                        I agree to the{" "}
                        <Link to="/terms" className="text-luxury-gold hover:text-luxury-gold-light">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-luxury-gold hover:text-luxury-gold-light">
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-luxury"
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Demo Credentials */}
        <div className="text-center space-y-3">
          <div className="bg-muted/50 rounded-lg p-4 text-sm">
            <p className="font-medium mb-2 text-muted-foreground">Customer Demo:</p>
            <p className="text-muted-foreground">Email: demo@luxe.com</p>
            <p className="text-muted-foreground">Password: demo123</p>
          </div>
          <div className="bg-luxury-gold/10 border border-luxury-gold/20 rounded-lg p-4 text-sm">
            <p className="font-medium mb-2 text-luxury-gold">Admin Access:</p>
            <p className="text-muted-foreground">Email: admin@luxe.com</p>
            <p className="text-muted-foreground">Password: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;