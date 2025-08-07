import { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';

export const metadata: Metadata = {
  title: 'Política de Privacidade | MediQuo + Vero',
  description: 'Política de Privacidade da plataforma MediQuo + Vero. Saiba como protegemos seus dados pessoais em conformidade com a LGPD.',
  keywords: ['política de privacidade mediquo', 'lgpd telemedicina', 'proteção dados saúde', 'privacidade consulta online'],
  openGraph: {
    title: 'Política de Privacidade - MediQuo + Vero',
    description: 'Conheça nossa Política de Privacidade e como protegemos seus dados na plataforma de telemedicina MediQuo + Vero',
    url: 'https://vero.mediquo.com.br/politicas-de-privacidade',
    siteName: 'MediQuo + Vero',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://vero.mediquo.com.br/politicas-de-privacidade',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PoliticasDePrivacidade() {
  return (
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 py-8 max-w-4xl pt-28">
      <h1 className="text-3xl font-bold mb-6 text-center text-pink-600">Política de Privacidade</h1>
      
      <div className="prose prose-lg max-w-none text-gray-700">
        <p className="mb-6">
          A MEDIQUO SAÚDE CONECTADA LTDA, inscrita no CNPJ sob o nº. 38.545.772/0001-81, com logradouro na Rua Santa Rita Durão, nº 20, 8º andar, Funcionários, Belo Horizonte, MG, CEP 30140-110, doravante, MediQuo, manifesta através desta Política o compromisso de cumprir com a legislação vigente acerca da proteção de dados, Lei Geral de Proteção de Dados (LGPD), Lei nº 13.709/2018 e suas alterações posteriores, bem como em todas as obrigações no que tange a proteção de dados que lhe sejam conferidas.
        </p>
        
        <p className="mb-6">
          Abaixo você encontrará toda a informação necessária sobre os dados pessoais que recolhemos, como os tratamos e os seus direitos.
        </p>
        
        <h2 className="text-2xl font-bold mb-4 text-pink-600">Resumo</h2>
        
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full border-collapse border border-gray-300">
            <tbody>
              <tr className="border-b">
                <td className="border border-gray-300 p-4 font-semibold bg-gray-50">Processador de dados</td>
                <td className="border border-gray-300 p-4">MEDIQUO SAÚDE CONECTADA LTDA (doravante, MediQuo)</td>
              </tr>
              <tr className="border-b">
                <td className="border border-gray-300 p-4 font-semibold bg-gray-50">Encarregado (DPO)</td>
                <td className="border border-gray-300 p-4">
                  Juliana de França Chaves<br />
                  Email: <a href="mailto:dpo@mediquo.com.br" className="text-pink-600 hover:underline">dpo@mediquo.com.br</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
}