'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { getUserProfile, updateUserProfile } from '@/services/user-service';
import { UserProfileApiResponse } from '@/types/user-types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MaskedInput } from '@/components/ui/masked-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, User, Mail, Phone, FileText, Save, Calendar, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';
import {
  VALIDATION_ERRORS,
  BUSINESS_ERRORS,
  SUCCESS_MESSAGES,
  formatErrorForToast,
  formatSuccessForToast
} from '@/config/error-messages';

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const { userData, signupData, token, isAuthenticated, isInitialized } = useAuth();
  const [profileData, setProfileData] = useState<UserProfileApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    phone: '',
    birthDate: '',
    gender: ''
  });

  // Função para converter data da API (YYYY-MM-DD) para formato de exibição (DD/MM/YYYY)
  const convertApiDateToDisplay = (apiDate: string): string => {
    if (!apiDate) return '';
    try {
      const [year, month, day] = apiDate.split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return '';
    }
  };

  // Função para converter data de exibição (DD/MM/YYYY) para formato da API (YYYY-MM-DD)
  const convertDisplayDateToApi = (displayDate: string): string => {
    if (!displayDate || displayDate.length !== 10) return '';
    try {
      const [day, month, year] = displayDate.split('/');
      return `${year}-${month}-${day}`;
    } catch {
      return '';
    }
  };

  // Determinar qual ID usar - priorizar userData, depois signupData
  const getUserId = () => {
    if (userData?.id) return userData.id;
    if (signupData?.id) return signupData.id;
    return null;
  };

  // Função para obter dados de fallback dos dados locais
  const getFallbackProfileData = () => {
    if (userData) {
      return {
        id: userData.id,
        fullName: userData.fullName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        documentNumber: userData.documentNumber || '',
        createdAt: userData.createdAt || new Date().toISOString(),
        updatedAt: userData.updatedAt || new Date().toISOString(),
        active: userData.active ?? true
      };
    }
    return null;
  };

  useEffect(() => {
    const loadProfile = async () => {
      // Só carregar quando o dialog estiver aberto
      if (!open) return;

      logger.info('ProfileDialog useEffect triggered', {
        isInitialized,
        isAuthenticated,
        userData: !!userData,
        signupData: !!signupData,
        userDataId: userData?.id,
        signupDataId: signupData?.id
      });

      // Aguardar inicialização do contexto
      if (!isInitialized) {
        logger.info('ProfileDialog waiting for initialization');
        return;
      }

      if (!isAuthenticated) {
        logger.info('ProfileDialog user not authenticated');
        setIsLoading(false);
        return;
      }

      const userId = getUserId();
      if (!userId) {
        logger.error('No user ID found in userData or signupData', { userData, signupData });

        // Tentar usar dados locais como fallback
        const fallbackData = getFallbackProfileData();
        if (fallbackData) {
          logger.info('Using fallback profile data from local context');
          setProfileData(fallbackData as UserProfileApiResponse);
          setEditForm({
            fullName: fallbackData.fullName || '',
            phone: fallbackData.phone || '',
            birthDate: (fallbackData as any).birthDate ? convertApiDateToDisplay((fallbackData as any).birthDate) : '',
            gender: (fallbackData as any).gender || ''
          });
        }

        setIsLoading(false);
        return;
      }

      logger.info('ProfileDialog loading profile for user ID:', userId);

      try {
        const response = await getUserProfile(userId);
        if (response.success && response.data) {
          logger.info('Profile data loaded successfully', response.data);
          setProfileData(response.data);
          setEditForm({
            fullName: response.data.fullName || '',
            phone: response.data.phone || '',
            birthDate: response.data.birthDate ? convertApiDateToDisplay(response.data.birthDate) : '',
            gender: response.data.gender || ''
          });
        } else {
          logger.error('Failed to load profile', response.error);

          // Tentar usar dados locais como fallback
          const fallbackData = getFallbackProfileData();
          if (fallbackData) {
            logger.info('API failed, using fallback profile data from local context');
            setProfileData(fallbackData as UserProfileApiResponse);
            setEditForm({
              fullName: fallbackData.fullName || '',
              phone: fallbackData.phone || '',
              birthDate: (fallbackData as any).birthDate ? convertApiDateToDisplay((fallbackData as any).birthDate) : '',
              gender: (fallbackData as any).gender || ''
            });

            toast({
              variant: "default",
              title: "Perfil carregado",
              description: "Exibindo dados locais. Algumas informações podem estar desatualizadas."
            });
          } else {
            toast(formatErrorForToast({
              title: "Erro ao carregar perfil",
              description: "Não foi possível carregar os dados do seu perfil.",
              actionable: "Tente recarregar a página ou contate o suporte."
            }));
          }
        }
      } catch (error) {
        logger.error('Error loading profile', error);

        // Tentar usar dados locais como fallback
        const fallbackData = getFallbackProfileData();
        if (fallbackData) {
          logger.info('Exception occurred, using fallback profile data from local context');
          setProfileData(fallbackData as UserProfileApiResponse);
          setEditForm({
            fullName: fallbackData.fullName || '',
            phone: fallbackData.phone || '',
            birthDate: (fallbackData as any).birthDate ? convertApiDateToDisplay((fallbackData as any).birthDate) : '',
            gender: (fallbackData as any).gender || ''
          });

          toast({
            variant: "default",
            title: "Dados locais carregados",
            description: "Exibindo dados locais devido a erro na conexão."
          });
        } else {
          toast(formatErrorForToast({
            title: "Erro de conexão",
            description: "Não foi possível carregar os dados do perfil.",
            actionable: "Verifique sua conexão e tente novamente."
          }));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [open, isAuthenticated, isInitialized, userData, signupData, toast]);

  const handleSave = async () => {
    const userId = getUserId();
    if (!profileData || !userId) return;

    // Validation
    if (!editForm.fullName.trim()) {
      toast(formatErrorForToast(VALIDATION_ERRORS.REQUIRED_FIELD("Nome completo")));
      return;
    }

    if (!editForm.phone.trim()) {
      toast(formatErrorForToast(VALIDATION_ERRORS.REQUIRED_FIELD("Telefone")));
      return;
    }

    setIsSaving(true);

    try {
      const updateData: any = {
        fullName: editForm.fullName.trim(),
        phone: editForm.phone.trim()
      };

      // Adicionar birthDate se preenchido
      if (editForm.birthDate.trim()) {
        const apiDate = convertDisplayDateToApi(editForm.birthDate.trim());
        if (apiDate) {
          updateData.birthDate = apiDate;
        }
      }

      // Adicionar gender se selecionado
      if (editForm.gender.trim()) {
        updateData.gender = editForm.gender.trim();
      }

      const response = await updateUserProfile(userId, updateData);

      if (response.success && response.data) {
        setProfileData(response.data);
        toast(formatSuccessForToast(SUCCESS_MESSAGES.PROFILE_UPDATED));
      } else {
        toast(formatErrorForToast(BUSINESS_ERRORS.PROFILE_UPDATE_FAILED));
      }
    } catch (error) {
      logger.error('Error updating profile', error);
      toast(formatErrorForToast({
        title: "Erro de conexão",
        description: "Não foi possível salvar as alterações.",
        actionable: "Verifique sua conexão e tente novamente."
      }));
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof typeof editForm, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  if (!isAuthenticated) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Acesso Restrito</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 text-center">
              Você precisa estar logado para acessar seu perfil.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)} variant="outline">
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (!isInitialized || isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Meu Perfil</DialogTitle>
          </DialogHeader>
          <div className="py-8">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg">Carregando perfil...</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!profileData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Perfil do Usuário</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Não foi possível carregar os dados do perfil.
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="mr-2"
              >
                Tentar Novamente
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)} variant="outline">
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Meu Perfil
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Email - Read Only */}
          <div className="space-y-2">
            <Label className="flex items-center text-sm font-medium text-gray-700">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600">
              {profileData.email}
            </div>
          </div>

          {/* Document Number - Read Only */}
          <div className="space-y-2">
            <Label className="flex items-center text-sm font-medium text-gray-700">
              <FileText className="h-4 w-4 mr-2" />
              Documento (CPF)
            </Label>
            <MaskedInput
              mask="999.999.999-99"
              value={profileData.documentNumber}
              disabled
              className="bg-gray-50 text-gray-600"
            />
          </div>

          {/* Full Name - Editable */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center text-sm font-medium text-gray-700">
              <User className="h-4 w-4 mr-2" />
              Nome Completo
            </Label>
            <Input
              id="fullName"
              value={editForm.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Digite seu nome completo"
              disabled={isSaving}
            />
          </div>

          {/* Phone - Editable */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center text-sm font-medium text-gray-700">
              <Phone className="h-4 w-4 mr-2" />
              Telefone
            </Label>
            <MaskedInput
              id="phone"
              mask="(99) 99999-9999"
              value={editForm.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="(00) 00000-0000"
              disabled={isSaving}
            />
          </div>

          {/* Birth Date - Editable */}
          <div className="space-y-2">
            <Label htmlFor="birthDate" className="flex items-center text-sm font-medium text-gray-700">
              <Calendar className="h-4 w-4 mr-2" />
              Data de Nascimento
            </Label>
            <MaskedInput
              id="birthDate"
              mask="99/99/9999"
              value={editForm.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
              placeholder="DD/MM/AAAA"
              disabled={isSaving}
            />
          </div>

          {/* Gender - Editable */}
          <div className="space-y-2">
            <Label htmlFor="gender" className="flex items-center text-sm font-medium text-gray-700">
              <Users className="h-4 w-4 mr-2" />
              Gênero
            </Label>
            <Select
              value={editForm.gender}
              onValueChange={(value) => handleInputChange('gender', value)}
              disabled={isSaving}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione seu gênero" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MASCULINO">Masculino</SelectItem>
                <SelectItem value="FEMININO">Feminino</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full sm:w-auto"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </>
            )}
          </Button>
          <Button onClick={handleClose} variant="outline" className="w-full sm:w-auto">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
