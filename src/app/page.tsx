'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SiteHeader } from '@/components/site-header';
import Image from 'next/image';
import {
  Check,
  Shield,
  ChevronDown,
  Heart,
  PawPrint,
  Star
} from 'lucide-react';

export default function Home() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const router = useRouter();

  const handleCTAClick = () => {
    router.push('/cliente/login');
  };

  const services = [
    {
      service: 'Clínicos 24h',
      howItWorks: 'Sem triagem: fale em até 10 min',
      benefit: 'Agilidade máxima',
    },
    {
      service: 'Consultas com especialistas',
      howItWorks: 'Atendimento por chat, ligação e vídeochamada',
      benefit: 'Sem coparticipação'
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
    <div className="min-h-screen bg-white overflow-x-hidden">
      <SiteHeader />
      {/* Hero Section */}
      <section className="relative overflow-hidden text-white pt-24" style={{ backgroundColor: '#D63066' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-48 h-48 md:w-96 md:h-96 rounded-full blur-3xl" style={{ backgroundColor: '#F3953F' }}></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 md:w-96 md:h-96 rounded-full blur-3xl" style={{ backgroundColor: '#FFD31B' }}></div>
        </div>
        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="md:w-1/2">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6" style={{ color: '#FFD31B' }}>
                Sua saúde na palma da mão: fale com médicos em até 10 minutos
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                Cuidar de você, da sua família e do seu pet nunca foi tão fácil, rápido e acessível.
              </p>

              <Button
                size="lg"
                className="text-gray-900 font-bold rounded-lg h-12 text-base px-8 transition-all duration-300 shadow-lg hover:shadow-xl hover:opacity-90"
                style={{ backgroundColor: '#FFD31B' }}
                onClick={handleCTAClick}
              >
                QUERO COMEÇAR AGORA
              </Button>
            </div>
          </div>
        </div>
        <div className="hidden md:block absolute right-0 bottom-0 w-1/2 h-full">
          <div className="relative h-full flex items-end justify-center">
            <div className="absolute top-10 right-10 md:top-20 md:right-20 w-32 h-32 md:w-64 md:h-64 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: '#F3953F' }}></div>
            <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 w-36 h-36 md:w-72 md:h-72 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: '#FFD31B' }}></div>
            <Image
              src="/foto-hero.png"
              alt="Mulher sorrindo enquanto usa o aplicativo MediQuo no celular para consulta médica online - Telemedicina 24 horas"
              title="Consulta médica online 24h - MediQuo + Vero"
              width={600}
              height={600}
              className="relative z-10 object-contain object-bottom w-full max-w-[600px] h-auto"
              priority
            />
          </div>
        </div>
      </section>

      {/* Por que escolher a MediQuo */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-stretch">
              <div className="flex justify-center">
                <Image
                  src="/foto-section-2.png"
                  alt="Mulher feliz usando smartphone para acessar consultas médicas online MediQuo - Atendimento médico 24 horas"
                  title="Por que escolher MediQuo - Consultas médicas online rápidas"
                  width={500}
                  height={500}
                  className="rounded-2xl w-full h-auto"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="space-y-10">
                  <h2 className="text-3xl md:text-4xl font-bold" style={{ color: '#8A0038' }}>
                    Por que escolher a Mediquo?
                  </h2>
                  <div>
                    <h3 className="font-bold text-xl mb-3" style={{ color: '#D63066' }}>Economia de tempo e dinheiro</h3>
                    <ul className="space-y-2">
                      <li className="text-gray-600 flex items-start gap-2">
                        <span className="text-base">• Preço acessível e sem coparticipação</span>
                      </li>
                      <li className="text-gray-600 flex items-start gap-2">
                        <span className="text-base">• Sem deslocamento ou fila de espera</span>
                      </li>
                      <li className="text-gray-600 flex items-start gap-2">
                        <span className="text-base">• Um valor fixo por mês, sem surpresas na fatura</span>
                      </li>
                      <li className="text-gray-600 flex items-start gap-2">
                        <span className="text-base">• Inclua filhos menores e pets sem custo extra</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-xl mb-3" style={{ color: '#D63066' }}>Atendimento 24h, 7 dias</h3>
                    <ul className="space-y-2">
                      <li className="text-gray-600 flex items-start gap-2">
                        <span className="text-base">• Clínicos gerais e pediatras em até 10 min, sem triagem</span>
                      </li>
                      <li className="text-gray-600 flex items-start gap-2">
                        <span className="text-base">• Atendimento por ligação, mensagem ou vídeo</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-xl mb-3" style={{ color: '#D63066' }}>Médicos e especialistas</h3>
                    <ul className="space-y-2">
                      <li className="text-gray-600 flex items-start gap-2">
                        <span className="text-base">• Clínicos gerais, pediatras, psicólogos, nutricionistas, educadores físicos, veterinários, dermatologistas e ginecologistas.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="font-bold rounded-lg h-12 text-base px-8 hover:opacity-90 mt-10"
                  style={{ backgroundColor: '#F3953F', color: '#8A0038' }}
                  onClick={() => router.push('/cliente/login')}
                >
                  Quero contratar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabela de Serviços */}
      <section className="py-20" style={{ backgroundColor: '#8A0038' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
              Nossos serviços principais
            </h2>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 text-white" style={{ backgroundColor: '#D63066' }}>
                <div className="p-6 text-center font-bold">Serviço</div>
                <div className="p-6 text-center font-bold border-l" style={{ borderColor: '#8A0038' }}>Como funciona</div>
                <div className="p-6 text-center font-bold border-l" style={{ borderColor: '#8A0038' }}>Benefício</div>
              </div>
              {services.map((item, index) => (
                <div key={index} className={`grid grid-cols-1 md:grid-cols-3 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-t`}>
                  <div className="p-6">
                    <div className="font-semibold text-gray-900 mb-2">{item.service}</div>
                  </div>
                  <div className="p-6 text-gray-600 md:border-l">{item.howItWorks}</div>
                  <div className="p-6 text-gray-600 md:border-l">{item.benefit}</div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button
                size="lg"
                className="text-gray-900 font-bold rounded-lg h-12 text-base px-8 hover:opacity-90"
                style={{ backgroundColor: '#FFD31B' }}
                onClick={() => router.push('/cliente/login')}
              >
                Quero contratar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20 text-white" style={{ backgroundColor: '#D63066' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Como Funciona na Prática
            </h2>
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-1/2 order-2 md:order-1 flex justify-center">
                <Image
                  src="/foto-section-4.png"
                  alt="Aplicativo MediQuo no iPhone mostrando lista de médicos disponíveis para consulta online - Interface do app de telemedicina"
                  title="App MediQuo - Interface de consultas médicas online"
                  width={500}
                  height={800}
                  className="drop-shadow-2xl w-full max-w-[300px] md:max-w-[400px] h-auto"
                  loading="lazy"
                />
              </div>
              <div className="w-full md:w-1/2 order-1 md:order-2 space-y-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold">1</span>
                    </div>
                    <h3 className="font-bold text-xl">Baixe o app</h3>
                  </div>
                  <p className="text-white/90 ml-16">Disponível na App Store e Google Play</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold">2</span>
                    </div>
                    <h3 className="font-bold text-xl">Ative seu plano</h3>
                  </div>
                  <p className="text-white/90 ml-16">Valide o código recebido na contratação do serviço</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold">3</span>
                    </div>
                    <h3 className="font-bold text-xl">Comece a consultar</h3>
                  </div>
                  <p className="text-white/90 ml-16">Em até 10 min você já está falando com o profissional</p>
                  <p className="text-sm text-white/70 ml-16 mt-2">Receitas e orientações válidas em todo o Brasil</p>
                </div>

                <Button
                  size="lg"
                  className="text-white font-bold rounded-lg h-12 text-base px-8 w-full md:w-auto hover:opacity-90"
                  style={{ backgroundColor: '#8A0038' }}
                  onClick={() => router.push('/cliente/login')}
                >
                  Quero conhecer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20" style={{ backgroundColor: '#F3953F' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
              Depoimentos de Clientes
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
                className="text-gray-900 font-bold rounded-lg h-12 text-base px-8 hover:opacity-90"
                style={{ backgroundColor: '#FFD31B' }}
                onClick={() => router.push('/cliente/login')}
              >
                Quero contratar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Planos e Preços */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              Contrate agora!
            </h2>
            <Card className="border-2 border-pink-200 shadow-2xl bg-white">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#D63066' }}>Mensal</h3>
                  <p className="text-gray-700 mb-6">Médicos + todas as especialidades</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-gray-900">R$15,90</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#D6306620' }}>
                      <Check className="h-4 w-4" style={{ color: '#D63066' }} />
                    </div>
                    <span className="text-gray-700">Médicos + todas as especialidades</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#D6306620' }}>
                      <Check className="h-4 w-4" style={{ color: '#D63066' }} />
                    </div>
                    <span className="text-gray-700">Dependentes menores de 18 anos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#D6306620' }}>
                      <Check className="h-4 w-4" style={{ color: '#D63066' }} />
                    </div>
                    <span className="text-gray-700">Atendimento para cães e gatos</span>
                  </div>
                </div>

                <Button
                  className="w-full text-gray-900 font-bold rounded-lg h-14 text-lg hover:opacity-90"
                  style={{ backgroundColor: '#FFD31B' }}
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
      <section className="py-20" style={{ backgroundColor: '#D63066' }}>
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
      <section className="py-20" style={{ backgroundColor: '#8A0038' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Pronto para revolucionar seu cuidado com a saúde?
            </h2>
            <Button
              size="lg"
              className="text-white font-bold rounded-lg h-14 text-lg px-12 transition-all duration-300 shadow-lg hover:shadow-xl hover:opacity-90"
              style={{ backgroundColor: '#D63066' }}
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
                MediQuo – Cuidar de você, da sua família e do seu pet nunca foi tão fácil.
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
