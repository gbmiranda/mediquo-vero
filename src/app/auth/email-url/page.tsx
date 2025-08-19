'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authenticateByEmailUrl } from '@/services/auth-service';
import { getUserProfile } from '@/services/user-service';
import { useToast } from '@/hooks/use-toast';
import { saveToken, saveSignupData, saveUserData, saveEmail, getUserIdFromToken } from '@/utils/auth-storage';
import gtag from '@/utils/analytics';

export default function EmailUrlAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const code = searchParams.get('code');

    if (!code) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Código de autenticação inválido."
      });
      router.push('/');
      return;
    }

    handleAuthentication(code);
  }, [searchParams, router, toast]);

  const handleAuthentication = async (code: string) => {
    try {
      setIsLoading(true);
      const response = await authenticateByEmailUrl(code);

      if (response.success && response.data) {
        // Salvar token
        saveToken(response.data.token, response.data.expiresIn);

        // Tentar extrair userId do token para buscar dados do usuário
        const userId = getUserIdFromToken();

        if (userId) {
          try {
            // Buscar dados do usuário usando o userId do token
            const userProfileResponse = await getUserProfile(userId);

            if (userProfileResponse.success && userProfileResponse.data) {
              // Salvar email do usuário
              saveEmail(userProfileResponse.data.email);

              // Salvar dados do usuário no localStorage
              const userData = {
                id: userProfileResponse.data.id,
                createdAt: userProfileResponse.data.createdAt,
                updatedAt: userProfileResponse.data.updatedAt,
                active: userProfileResponse.data.active,
                fullName: userProfileResponse.data.fullName,
                email: userProfileResponse.data.email,
                phone: userProfileResponse.data.phone,
                documentNumber: userProfileResponse.data.documentNumber,
                birthDate: userProfileResponse.data.birthDate,
                gender: userProfileResponse.data.gender
              };
              saveUserData(userData);

              // Criar signupData baseado nos dados reais do usuário
              const signupData = {
                id: userProfileResponse.data.id,
                createdAt: userProfileResponse.data.createdAt,
                updatedAt: userProfileResponse.data.updatedAt,
                active: userProfileResponse.data.active,
                needMoreInformation: response.data.needMoreInformation
              };
              saveSignupData(signupData);
              
              // GA4: Set User ID e evento de login/signup
              gtag.setUserId(userProfileResponse.data.id);
              
              // Se needMoreInformation é true, é um novo usuário (signup)
              // Se é false, é um usuário existente (login)
              if (response.data.needMoreInformation) {
                gtag.signUp('email_link');
              } else {
                gtag.login('email_link');
              }

              // Redirecionar baseado em needMoreInformation
              if (response.data.needMoreInformation) {
                router.push('/cliente/complete-profile');
              } else {
                // Pequeno delay para garantir que o localStorage foi atualizado
                setTimeout(() => {
                  window.location.href = '/cliente/atendimento';
                }, 100);
              }
              return;
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
            // Continuar com fallback em caso de erro
          }
        }

        // Fallback: Se não conseguir buscar dados do usuário, usar dados simulados
        if (response.data.needMoreInformation) {
          const simulatedSignupData = {
            id: 0, // ID fictício
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            active: true,
            needMoreInformation: true
          };
          saveSignupData(simulatedSignupData);
          router.push('/cliente/complete-profile');
        } else {
          const simulatedSignupData = {
            id: 1, // ID fictício
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            active: true,
            needMoreInformation: false
          };
          saveSignupData(simulatedSignupData);

          // Pequeno delay para garantir que o localStorage foi atualizado
          setTimeout(() => {
            window.location.href = '/cliente/atendimento';
          }, 100);
        }

      } else {
        throw new Error(response.error || 'Falha na autenticação');
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      toast({
        variant: "destructive",
        title: "Erro de Autenticação",
        description: error instanceof Error ? error.message : "Falha na autenticação. Tente novamente."
      });
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Autenticando...</p>
        </div>
      </div>
    );
  }

  return null;
}
