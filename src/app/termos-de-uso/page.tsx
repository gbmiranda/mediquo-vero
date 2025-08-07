import { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';

export const metadata: Metadata = {
  title: 'Termos de Uso | MediQuo + Vero',
  description: 'Termos e Condições de Uso da plataforma MediQuo + Vero. Consultas médicas online 24h, telemedicina segura e regulamentada.',
  keywords: ['termos de uso mediquo', 'termos telemedicina', 'regulamentação consulta online', 'termos de serviço saúde digital'],
  openGraph: {
    title: 'Termos de Uso - MediQuo + Vero',
    description: 'Leia os Termos e Condições de Uso da plataforma de telemedicina MediQuo + Vero',
    url: 'https://vero.mediquo.com.br/termos-de-uso',
    siteName: 'MediQuo + Vero',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://vero.mediquo.com.br/termos-de-uso',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermosDeUso() {
  return (
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 py-8 max-w-4xl pt-28">
      <h1 className="text-3xl font-bold mb-6 text-center text-pink-600">TERMOS E CONDIÇÕES DE USO DA PLATAFORMA Vero + MediQuo</h1>
      
      <div className="prose prose-lg max-w-none text-gray-700">
        <p className="mb-4">Olá, Pacientes e Profissionais de Saúde,</p>
        
        <p className="mb-6">
          Agradecemos por acessar a MediQuo, uma plataforma pertencente a MediQuo Saúde Conectada Ltda, inscrita no CNPJ sob o nº 38.545.772/0001-81, sediada à Rua Santa Rita Durão, nº 20, 8º andar, bairro Funcionários, Belo Horizonte/MG - CEP 30.140-110. Nós temos como missão cuidar dos nossos pacientes e de quem eles amam e, por tal motivo, somos responsáveis por fornecer a estes a possibilidade de se conectarem a Profissionais de Saúde e demais serviços relacionados aos cuidados voltados ao bem estar pessoal e da família para a realização de atendimentos na área da saúde, podendo incluir, a depender do plano em que o Usuário opte, especialidades médicas e multiprofissionais como psicologia, nutrição, educação física, entre outros recursos para cuidados. Tudo por meio da plataforma digital da MediQuo, a qual é uma das maiores plataformas de telemedicina da Europa e América Latina, cuja funcionalidade se dá exclusivamente pelos seus aplicativos (APP) desenvolvidos para smartphones com sistemas operacionais Android e iOS, encontrados na Play Store e na App Store (Apple), denominados MediQuo, para Pacientes/Usuários;
        </p>
        
        <p className="mb-6">Para a exata compreensão e interpretação dos direitos e obrigações previstos no presente Termo, são adotadas as seguintes definições:</p>
        
        <h3 className="text-lg font-bold mb-4 text-pink-600">DEFINIÇÕES</h3>
        
        <div className="mb-6 space-y-4">
          <p><strong>a) Plataforma:</strong> ferramenta eletrônica que oferece um espaço virtual para a prática da telessaúde e teleorientação entre os Pacientes e os Profissionais de Saúde de diferentes áreas, podendo contemplar atendimento pré-clínico, suporte assistencial, teleconsulta, orientação, monitoramento e diagnóstico. A Plataforma engloba o software, o website e seus subdomínios, os aplicativos MediQuo, MediQuo Pro, MediQuo HUB e MediQuo Vero e versões para web, os smartphones com sistemas operacionais IOS e Android, programas e demais extensões.</p>
          
          <p><strong>b) Paciente/Usuário:</strong> pessoa física com mais de 18 (dezoito) anos de idade completos, que deseja utilizar a solução MediQuo e, para isso, concorda com os Termos de Uso e demais políticas da Plataforma.</p>
          
          <p><strong>c) Dependente:</strong> pessoa física dependente legal do Paciente, com idade inferior a 18 anos, poderão fazer consultas acompanhados de seus responsáveis pelo APP.</p>
          
          <p><strong>d) Profissional de Saúde:</strong> Profissional da saúde regularmente inscrito no seu respectivo Conselho e autorizado a oferecer serviços de telessaúde e teleorientação, que deseja utilizar a solução MediQuo Pro e, para isso, concorda com os Termos de Uso e demais políticas da Plataforma.</p>
          
          <p><strong>e) Cadastro:</strong> dados pessoais do Paciente ou dados dos Profissionais da Saúde, obrigatoriamente preenchidos por estes, diretamente no website disponível pela MediQuo ou pelos APP's.</p>
          
          <p><strong>f) Login:</strong> O usuário poderá logar através de senha gerada pelo sistema via SMS ou e-mails Apple, google ou facebook nos casos de Pacientes;</p>
          
          <p><strong>g) Parceiros:</strong> Pessoas Jurídicas associadas à MediQuo que podem auxiliar na prestação de serviços específicos ou divulgação da funcionalidade para terceiros.</p>
        </div>
        
        <h3 className="text-lg font-bold mb-4 text-pink-600">– CONDIÇÕES GERAIS –</h3>
        
        <div className="mb-6 space-y-4">
          <p><strong>1.1. Âmbito.</strong> Os presentes Termos e Condições Gerais de Uso, Consentimento Livre e Esclarecido (denominado somente "Termos de Uso" ou "Termos") vinculam todas as atividades desenvolvidas e serviços oferecidos pelo MediQuo por meio da Plataforma MediQuo (denominada somente "Plataforma"), que engloba o software, o website e seus subdomínios, aplicativos, programas e demais extensões. A Plataforma está sob responsabilidade e gestão da MediQuo Saúde Conectada Ltda., inscrita no CNPJ sob o nº 38.545.772/0001-81, sediada à Rua Santa Rita Durão, nº 20, 8º andar, bairro Funcionários, Belo Horizonte/MG - CEP 30.140-110.</p>
          
          <p><strong>1.2. Licenças e Autorizações para Funcionamento.</strong> A MediQuo Saúde Conectada Ltda. está regularmente inscrita junto ao Conselho Federal de Medicina sob o CRM nº 20.245-MG, tendo como responsável técnico médico o Dr. CASSIO FERNANDO REIS, inscrição nº 33167-MG, licença junto ao Cadastro Nacional de Estabelecimentos de Saúde (CNES) sob o nº 5623030.</p>
          
          <p><strong>1.3. Atuação.</strong> A Plataforma fornece aos Pacientes/Usuários serviços de telessaúde por meio de disponibilização de profissionais de saúde de maneira remota, com orientações e cuidados para a saúde. ("serviços").</p>
          
          <p><strong>1.4. Serviços.</strong> Os Pacientes, por intermédio da MediQuo, poderão buscar Profissionais de Saúde para a prestação dos seguintes serviços:</p>
          
          <p className="ml-4">Telessaúde e Teleorientação, em acesso com validade de 24 (vinte e quatro) horas para fins de consulta, por meio de formato web</p>
          
          <p><strong>1.4.1.</strong> A Plataforma se destina apenas aos serviços descritos na cláusula acima, não devendo ser utilizada como substituição de consultas com profissionais da saúde a que deva ou que deveria ser o Paciente submetido física e presencialmente. Portanto, o Paciente não deverá utilizar a Plataforma:</p>
        </div>
      </div>
    </div>
    </>
  );
}