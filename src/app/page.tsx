'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteHeader } from '@/components/site-header';
import Image from 'next/image';
import { 
  Check, 
  Clock, 
  Shield, 
  Smartphone, 
  ChevronDown, 
  Loader2, 
  Users, 
  Heart,
  PawPrint,
  Calendar,
  MessageCircle,
  Star,
  DollarSign,
  Phone,
  Video,
  Brain,
  Apple,
  Dumbbell,
  Baby,
  Stethoscope
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatErrorForToast } from '@/config/error-messages';

export default function Home() {
  const [email, setEmail] = useState('');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { requestOTP } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    try {
      const result = await requestOTP(email);

      if (result.success) {
        router.push('/cliente/login');
      } else {
        const errorMsg = result.error || 'Erro ao solicitar código de verificação';
        toast(formatErrorForToast({
          title: "Erro ao solicitar código",
          description: "Não foi possível enviar o código de verificação.",
          actionable: "Verifique o email e tente novamente."
        }));
      }
    } catch (error) {
      toast(formatErrorForToast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor.",
        actionable: "Verifique sua conexão e tente novamente."
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    {
      service: 'Clínicos 24h',
      howItWorks: 'Sem triagem: fale em até 10 min',
      benefit: 'Agilidade máxima',
      description: 'Atendimento por chat, ligação e videochamada. Sem coparticipação.'
    },
    {
      service: 'Consultas com especialistas',
      howItWorks: 'Agende com psicólogos, nutricionistas e treinadores',
      benefit: 'Saúde mental, física e nutricional completa'
    },
    {
      service: 'Psicologia, Nutrição e Fitness',
      howItWorks: 'Agende com psicólogos, nutricionistas e treinadores',
      benefit: 'Saúde mental, física e nutricional completa'
    },
    {
      service: 'Veterinário Online',
      howItWorks: 'Teleatendimento para cães e gatos',
      benefit: 'Cuidado 360° para toda a família'
    }
  ];

  const faqItems = [
    {
      question: 'Posso incluir mais de um filho?',
      answer: 'Sim! Sem limites e sem custo adicional.'
    },
    {
      question: 'Preciso de convênio para agendar especialistas?',
      answer: 'Não. Tudo pelo app, sem burocracia.'
    },
    {
      question: 'Todas as especialidades precisam de agendamento?',
      answer: 'Não. Clínico, Pediatra, Veterinário e Ginecologista não precisam de agendamento. As demais especialidades precisam ser agendadas.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-500 to-pink-600 text-white pt-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-96 h-96 bg-orange-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                Sua saúde na palma da sua mão: fale com médicos em até 10 minutos
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                Cuidar de você, da sua família e do seu pet nunca foi tão fácil, rápido e acessível.
              </p>

              <form onSubmit={handleSubmit} className="max-w-md">
                <div className="flex flex-col gap-4">
                  <Input
                    type="email"
                    placeholder="Digite seu e-mail para começar"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="h-12 text-gray-900 rounded-lg px-5 text-base bg-white"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg h-12 text-base px-8 transition-all duration-300 shadow-lg hover:shadow-xl"
                    disabled={isSubmitting || !email.trim()}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      'QUERO COMEÇAR AGORA'
                    )}
                  </Button>
                </div>
              </form>
            </div>
            <div className="hidden md:flex justify-center items-center">
              <div className="relative">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-orange-400 rounded-full opacity-30 blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-yellow-400 rounded-full opacity-30 blur-2xl"></div>
                <div className="relative bg-white rounded-full p-2 shadow-2xl">
                  <div className="w-72 h-72 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-24 h-24 text-pink-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Por que escolher a MediQuo */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              Por que escolher a Mediquo?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                    <DollarSign className="h-6 w-6 text-pink-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-3 text-gray-900">Economia de tempo e dinheiro</h3>
                  <ul className="space-y-2">
                    <li className="text-gray-600 flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Preço acessível e sem coparticipação</span>
                    </li>
                    <li className="text-gray-600 flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Sem deslocamento ou fila de espera</span>
                    </li>
                    <li className="text-gray-600 flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Um valor fixo por mês, sem surpresas na fatura</span>
                    </li>
                    <li className="text-gray-600 flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Inclua filhos menores e pets sem custo extra</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-3 text-gray-900">Atendimento 24h, 7 dias</h3>
                  <ul className="space-y-2">
                    <li className="text-gray-600 flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Clínicos gerais e pediatras em até 10 min, sem triagem</span>
                    </li>
                    <li className="text-gray-600 flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Atendimento por ligação, mensagem ou vídeo</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                    <Stethoscope className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-3 text-gray-900">Médicos e especialistas</h3>
                  <ul className="space-y-2">
                    <li className="text-gray-600 flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Clínicos gerais, pediatras, psicólogos</span>
                    </li>
                    <li className="text-gray-600 flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Nutricionistas, educadores físicos</span>
                    </li>
                    <li className="text-gray-600 flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Veterinários, dermatologistas e ginecologistas</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Tabela de Serviços */}
      <section className="py-16 bg-purple-900">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
              Nossos serviços principais
            </h2>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 bg-pink-600 text-white">
                <div className="p-6 text-center font-bold">Serviço</div>
                <div className="p-6 text-center font-bold border-l border-pink-500">Como funciona</div>
                <div className="p-6 text-center font-bold border-l border-pink-500">Benefício</div>
              </div>
              {services.map((item, index) => (
                <div key={index} className={`grid grid-cols-1 md:grid-cols-3 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-t`}>
                  <div className="p-6">
                    <div className="font-semibold text-gray-900 mb-2">{item.service}</div>
                    {item.description && (
                      <div className="text-sm text-gray-500">{item.description}</div>
                    )}
                  </div>
                  <div className="p-6 text-gray-600 md:border-l">{item.howItWorks}</div>
                  <div className="p-6 text-gray-600 md:border-l">{item.benefit}</div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button
                size="lg"
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg h-12 text-base px-8"
                onClick={() => router.push('/cliente/login')}
              >
                Quero contratar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-16 bg-gradient-to-br from-pink-500 to-pink-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Como Funciona na Prática (Em 3 Passos)
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold">1</span>
                </div>
                <h3 className="font-bold text-xl mb-2">Baixe o app</h3>
                <p className="text-white/80">Disponível na App Store e Google Play</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold">2</span>
                </div>
                <h3 className="font-bold text-xl mb-2">Ative seu plano</h3>
                <p className="text-white/80">Valide o código recebido na contratação do serviço</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold">3</span>
                </div>
                <h3 className="font-bold text-xl mb-2">Comece a consultar</h3>
                <p className="text-white/80">Em até 10 min você já está falando com o profissional</p>
                <p className="text-sm text-white/60 mt-2">Receitas e orientações válidas em todo o Brasil</p>
              </div>
            </div>
            <div className="text-center mt-12">
              <Button
                size="lg"
                className="bg-white hover:bg-gray-100 text-pink-600 font-bold rounded-lg h-12 text-base px-8"
                onClick={() => router.push('/cliente/login')}
              >
                Quero conhecer
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-16 bg-orange-400">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
              Depoimentos de Clientes (Pilot B2C)
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-0 shadow-xl bg-white">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic text-lg">
                    "Consegui falar com um pediatra às 2 da manhã quando meu filho passou mal. Foi um alívio!"
                  </p>
                  <p className="font-bold text-gray-900">— Ana P., São Paulo</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic text-lg">
                    "Agora eu renovo as minhas fichas de treino com facilidade e sem gastar nada por isso"
                  </p>
                  <p className="font-bold text-gray-900">— Victória F., Belo Horizonte</p>
                </CardContent>
              </Card>
            </div>
            <div className="text-center mt-8">
              <Button
                size="lg"
                className="bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg h-12 text-base px-8"
                onClick={() => router.push('/cliente/login')}
              >
                Quero contratar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Planos e Preços */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              Contrate agora!
            </h2>
            <Card className="border-2 border-pink-200 shadow-2xl bg-white">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-pink-600 mb-4">Mensal</h3>
                  <p className="text-gray-700 mb-6">Médicos + todas as especialidades</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-gray-900">R$15,90</span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-pink-600" />
                    </div>
                    <span className="text-gray-700">Médicos + todas as especialidades</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-pink-600" />
                    </div>
                    <span className="text-gray-700">Dependentes menores de 18 anos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-pink-600" />
                    </div>
                    <span className="text-gray-700">Atendimento para cães e gatos</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg h-14 text-lg"
                  onClick={() => router.push('/cliente/checkout')}
                >
                  Assinar agora
                </Button>
                <p className="text-center text-sm text-gray-600 mt-3">Quero meu acesso agora</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-purple-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
              Perguntas Frequentes (FAQ)
            </h2>
            <p className="text-center text-white/80 mb-12">
              Posso incluir mais de um filho?<br/>
              Sim! Sem limites e sem custo adicional.
            </p>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <Card
                  key={index}
                  className="cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/10 backdrop-blur-sm"
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg text-white pr-4">{item.question}</h3>
                      <div className={`p-2 rounded-full bg-white/20 text-white transition-transform flex-shrink-0 ${openFAQ === index ? 'rotate-180' : ''}`}>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>
                  </CardHeader>
                  {openFAQ === index && (
                    <CardContent className="pt-0">
                      <p className="text-white/90">{item.answer}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-yellow-400">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Pronto para revolucionar seu cuidado com a saúde?
            </h2>
            <Button
              size="lg"
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg h-14 text-lg px-12 transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={() => router.push('/cliente/login')}
            >
              Quero meu acesso agora
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <p className="mb-3 text-base">
                MediQuo Vero – Cuidar de você, da sua família e do seu pet nunca foi tão fácil.
              </p>
              <div className="flex items-center justify-center gap-4 text-white/60 mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm">Consulta 100% segura</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm">Cuidado completo</span>
                </div>
                <div className="flex items-center gap-2">
                  <PawPrint className="h-4 w-4" />
                  <span className="text-sm">Pets inclusos</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="https://mediquo.com.br/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">Sobre</a>
              <a href="/termos-de-uso" className="text-white/60 hover:text-white transition-colors">Termos de Uso</a>
              <a href="/politicas-de-privacidade" className="text-white/60 hover:text-white transition-colors">Políticas de Privacidade</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}