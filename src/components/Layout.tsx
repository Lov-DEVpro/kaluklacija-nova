import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Home, LogOut, FileText, User } from 'lucide-react';
import baupartnerLogo from '@/assets/baupartner-logo.gif';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <Link to="/" className="flex items-center gap-3">
              <img 
                src={baupartnerLogo} 
                alt="Baupartner Logo" 
                className="h-10 object-contain bg-white rounded p-1"
              />
              <span className="font-bold text-lg hidden sm:inline">
                Kalkulacije montažnih konstrukcija
              </span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link to="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Početna</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link to="/kalkulacije" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Sve kalkulacije</span>
                </Link>
              </Button>
              
              {user && (
                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-primary-foreground/20">
                  <div className="flex items-center gap-1 text-sm text-primary-foreground/80">
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline max-w-32 truncate">
                      {user.email}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">Odjava</span>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-muted mt-auto py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Baupartner d.o.o. - Sva prava zadržana
        </div>
      </footer>
    </div>
  );
}
