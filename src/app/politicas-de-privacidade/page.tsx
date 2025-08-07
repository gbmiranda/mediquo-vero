import { SiteHeader } from '@/components/site-header';

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
                  Você pode entrar em contato por meio do nosso DPO (Leandro Cazeiro) para exercer os seus direitos, reconhecidos nas normas de proteção de dados, através do email: dpo@mediquo.com.br ou por meio do nosso suporte constante na aplicação.
                </td>
              </tr>
              <tr className="border-b">
                <td className="border border-gray-300 p-4 font-semibold bg-gray-50">Finalidades do Tratamento</td>
                <td className="border border-gray-300 p-4">
                  <p className="font-semibold mb-2">SERVIÇOS DE TELEMEDICINA</p>
                  <ul className="list-disc ml-4 mb-4">
                    <li>Prestação de serviços de telemedicina (planos ou de forma avulsa).</li>
                  </ul>
                  
                  <p className="font-semibold mb-2">SEGURANÇA</p>
                  <ul className="list-disc ml-4 mb-4">
                    <li>Detecção e investigação de fraudes, outras atividades ilegais e potenciais violações dos nossos "Termos de Uso".</li>
                  </ul>
                  
                  <p className="font-semibold mb-2">INTERAÇÃO COM USUÁRIO</p>
                  <ul className="list-disc ml-4">
                    <li>Estudos estatísticos para analisar o comportamento e tendências do usuário.</li>
                    <li>Pesquisa, análise, desenvolvimento e melhoria das características dos serviços.</li>
                    <li>Envio de comunicações via email e/ou SMS ao usuário sobre o funcionamento do serviço.</li>
                    <li>Envio de comunicações promocionais e ofertas relacionadas com o serviço.</li>
                  </ul>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border border-gray-300 p-4 font-semibold bg-gray-50">Legitimidade do Tratamento de Dados</td>
                <td className="border border-gray-300 p-4">
                  <ul className="list-disc ml-4">
                    <li>Obrigação legal.</li>
                    <li>Execução de contrato.</li>
                    <li>Interesse legítimo, para realizar análises sobre a utilização do aplicativo.</li>
                    <li>Consentimento expresso.</li>
                  </ul>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border border-gray-300 p-4 font-semibold bg-gray-50">Com quem meus dados são compartilhados</td>
                <td className="border border-gray-300 p-4">
                  <ul className="list-disc ml-4">
                    <li>Mediquo Saúde Conectada Ltda.</li>
                    <li>Medipremium Servicios Médicos S. L.</li>
                    <li>Ferramentas que a MediQuo contrata para auxiliá-la na prestação de serviços.</li>
                  </ul>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border border-gray-300 p-4 font-semibold bg-gray-50">Direitos do usuário</td>
                <td className="border border-gray-300 p-4">
                  <p className="mb-2">O interessado tem o direito de exercer os seus direitos contidos no artigo 18 da LGPD:</p>
                  <ul className="list-disc ml-4">
                    <li>Confirmação da existência do tratamento dos seus dados.</li>
                    <li>Acesso aos seus dados.</li>
                    <li>Corrigir informações incompletas, imprecisas ou desatualizadas.</li>
                    <li>Anonimizar, bloquear ou excluir dados desnecessários ou excessivos que não estejam sendo processados de acordo com a LGPD.</li>
                    <li>Tornar seus dados portáteis, ou seja, podem ser fornecidos a outro serviço ou processador se solicitado.</li>
                    <li>Ter seus dados excluídos.</li>
                    <li>Informações sobre entidades públicas ou privadas com as quais o responsável pelo tratamento tenha partilhado dados.</li>
                    <li>Informações sobre a possibilidade de recusar o consentimento e as consequências.</li>
                    <li>Revogar consentimento.</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h2 className="text-2xl font-bold mb-4 text-purple-700">Quem trata os meus dados pessoais?</h2>
        
        <p className="mb-4">
          A MediQuo é a responsável pelo tratamento, uma vez que trata em nome próprio os interessados ou pessoas físicas titulares dos dados pessoais para fins de prestação de serviço de telemedicina.
        </p>
        
        <p className="mb-4">
          No caso de dados pessoais de saúde, os quais estão inseridos os dados sensíveis sobre saúde, tais serão tratados exclusivamente pelos médicos e profissionais de saúde por meio de interação direta destes com o Usuário por meio da plataforma da MediQuo. Parceiros e demais ferramentas prestadoras de serviços não terão acesso a dados sensíveis, mas apenas cadastrais.
        </p>
        
        <p className="mb-6">
          Caso haja alguma dúvida, consulta ou queira exercer algum dos direitos que as normas de proteção de dados reconhecem aos seus titulares, pode contactar o nosso DPO (Leandro Cazeiro) via e-mail, endereçando sua demanda à dpo@mediquo.com.br.
        </p>
        
        <h2 className="text-2xl font-bold mb-4 text-purple-700">II. Que legitimidade tem a MediQuo para o tratamento de dados?</h2>
        
        <p className="mb-4">
          De acordo com as finalidades de tratamento que são posteriormente coletadas, a MediQuo trata os dados coletados de acordo com as bases legitimadoras constantes do artigo 7º da Lei Federal nº 13.079/2018 (LGPD).
        </p>
        
        <p className="mb-4">
          O tratamento dos <strong>dados cadastrais</strong> coletados pela MediQuo para fins da prestação do serviço de telemedicina se dá em razão da contratação que restou realizada pelo Usuário (contratação direta) isto é, se trata de tratamento fundamentado no art. 7º, V, da LGPD.
        </p>
        
        <p className="mb-4">
          Por outro lado, ao coletar <strong>dados sensíveis</strong> (informações sobre saúde do usuário, receitas, prescrições, atestados, dentre outros), tais se dão em consequência da necessidade de apuração do estado de saúde e histórico do paciente para fins de tratamento e orientação, bem como para fins de prontuário. No caso, por envolver dados relativos à saúde do paciente, tais são tratados pelos médicos e demais profissionais da saúde da MediQuo com fundamento no art. 11, 'f', da LGPD.
        </p>
        
        <p className="mb-4">
          O consentimento expresso será também a base legitimadora para o envio de comunicações comerciais através de chamada telefónica, email, mensagens push, pop-up e/ou envio de SMS ao usuário.
        </p>
        
        <p className="mb-6">
          Nos casos de <strong>inscrições em eventos realizados pela MediQuo, downloads de materiais, acesso a textos em páginas de contato da MediQuo</strong>, o Usuário concederá a autorização expressa por meio do fornecimento de dados cadastrais requeridos no momento da solicitação. Diante disso, entende-se como fundamento para a coleta desses dados o art. 7º, I da LGPD.
        </p>
        
        <h2 className="text-2xl font-bold mb-4 text-purple-700">III. Que informações a MediQuo coleta?</h2>
        
        <p className="mb-4 font-semibold">Exclusivamente para os serviços de Telemedicina:</p>
        
        <h3 className="text-lg font-semibold mb-3">a) Informações fornecidas diretamente pelo Usuário:</h3>
        
        <p className="mb-2">A MediQuo coleta e armazena certas informações que o Usuário fornece e compartilha:</p>
        
        <ul className="list-disc ml-6 mb-6 space-y-4">
          <li>
            <strong>Dados recolhidos durante o registo:</strong> as informações que o usuário fornece para se tornar um paciente MediQuo. São dados identificativos, como email e dados pessoais: nome e sobrenome, data de nascimento e sexo.
          </li>
          <li>
            <strong>Dados do histórico médico:</strong> O paciente prestará a informação para o profissional de saúde durante a consulta, mas estes dados não podem ser inseridos diretamente pelo usuário na plataforma, pois será o profissional quem preencherá esta seção, desde que o usuário forneça os dados correspondentes. São dados sensíveis porque são relacionados com a saúde e serão os seguintes: peso, idade, alergias, histórico, rotinas, tratamentos e/ou doenças.
          </li>
          <li>
            <strong>Dados de chat:</strong> a MediQuo registra todas as conversas entre um usuário e um profissional de saúde para que possam ser posteriormente consultadas por outro profissional devidamente legitimado em caso de nova consulta.
          </li>
          <li>
            <strong>Informações adicionais que o usuário compartilha via chat:</strong> são informações que o usuário MediQuo deseja compartilhar e que podem ser de identificação. Isto inclui histórico médico, imagens, vídeos, arquivos, registros médicos, raios-x ou qualquer outra informação relacionada à sua saúde.
          </li>
          <li>
            <strong>Dados relativos à saúde de um menor:</strong> o usuário só poderá compartilhar dados de menores sob autorização dos pais ou responsáveis, de acordo com a legislação.
          </li>
        </ul>
        
        <h3 className="text-lg font-semibold mb-3">b) Informações que os Usuários nos fornecem indiretamente:</h3>
        
        <ul className="list-disc ml-6 mb-6 space-y-4">
          <li>
            <strong>Dados do aplicativo e do dispositivo:</strong> a MediQuo armazena os dados do dispositivo de conexão que o Usuário utiliza para acessar os serviços. São eles: o endereço IP da internet que o Usuário utiliza para se conectar com seu computador ou celular, informações sobre seu computador ou celular, como conexão à internet, tipo de navegador, versão e sistema operacional, e o tipo de dispositivo, o todo o fluxo de cliques dos Uniform Resource Locators (URLs), incluindo data e hora, o número do cookie do Usuário, o histórico de navegação e as preferências do Usuário.
          </li>
          <li>
            <strong>Dados derivados da origem do Usuário:</strong> se o Usuário chegar ao site MediQuo através de uma fonte externa (como um link de outro site ou de uma rede social), a MediQuo recolhe os dados da fonte de onde provém o Usuário.
          </li>
          <li>
            <strong>Demais dados que o Usuário venha a fornecer para fins de download de documento ou de participação em eventos realizados pela MediQuo.</strong>
          </li>
        </ul>
        
        <h2 className="text-2xl font-bold mb-4 text-purple-700">4. Com que finalidade são recolhidos os dados?</h2>
        
        <p className="mb-4">A MediQuo utiliza dados pessoais para as seguintes finalidades:</p>
        
        <ol className="list-decimal ml-6 mb-6 space-y-4">
          <li>
            Os diferentes médicos e especialistas que prestam o serviço oferecido pela MediQuo através do seu Portal web ou App poderão acessar a Informação que o usuário compartilhou com qualquer um dos referidos médicos da MediQuo com o único propósito de que qualquer um deles possa prestar o serviço. O usuário também pode salvar dados médicos básicos em seu perfil, que serão compartilhados automaticamente com os médicos. Os médicos também poderão modificar esses dados para corrigir e completar as informações, sempre que indispensável.
          </li>
          <li>
            A MediQuo também utiliza as informações cadastrais para pesquisar e analisar como otimizar seus serviços e para o desenvolvimento e melhoria das funcionalidades do serviço que oferece.
          </li>
          <li>
            A MediQuo pode usar as informações do usuário com a finalidade de detectar e investigar fraudes, atividades ilegais e possíveis violações de nossos "Termos de Uso".
          </li>
          <li>
            Internamente, a MediQuo utiliza as informações para fins estatísticos, a fim de analisar o comportamento e as tendências dos Usuários, para entender como os mesmos utilizam o Aplicativo e o Site MediQuo para gerenciar e melhorar os serviços oferecidos.
          </li>
          <li>
            Como também, a MediQuo poderá utilizar os dados pessoais que o Usuário fornecerá para realizar comunicações por meio de chamada telefônica, e-mail, mensagens push, pop up e/ou enviar SMS ao usuário a respeito do funcionamento do serviço e/ou realização de pesquisas de satisfação acerca do mesmo.
          </li>
        </ol>
        
        <p className="mb-6">
          A MediQuo compromete-se a não recolher informações desnecessárias sobre os seus clientes ou usuários, a tratar diligentemente as informações pessoais que lhe sejam fornecidas e a cumprir em qualquer fase do tratamento de dados a obrigação de manter o devido sigilo.
        </p>
        
        <h2 className="text-2xl font-bold mb-4 text-purple-700">V. Durante quanto tempo conservaremos os seus dados?</h2>
        
        <p className="mb-4">
          Seus dados pessoais serão processados pelo período necessário para cumprir as finalidades estabelecidas nesta Política de Privacidade, bem como para reter suas informações pessoais em conformidade com o disposto nas leis e regulamentos pertinentes, especialmente em relação aos prazos legais de prescrição, e para a formulação, exercício ou defesa de reivindicações.
        </p>
        
        <p className="mb-4">
          Os critérios que seguimos para tal são determinados pela finalidade dos dados recolhidos e pelo cumprimento dessa finalidade (ex.: em caso de consentimento, pode revogar a qualquer momento) e pelos prazos de conservação exigidos de acordo com requisitos contratuais e normativos.
        </p>
        
        <p className="mb-4">
          Observe que, em alguns casos, poderemos conservar os seus dados pelo período necessário à formulação, exercício ou defesa de reclamações, requerimentos, responsabilidades e obrigações legais e/ou contratuais, estando sempre devidamente bloqueados.
        </p>
        
        <p className="mb-6">
          Caso o usuário revogue o consentimento para o tratamento dos seus dados ou solicite o seu cancelamento (e desde que tenha esse direito de acordo com a regulamentação), a MediQuo procederá ao seu bloqueio e só os manterá durante os períodos necessários de acordo com com a legislação.
        </p>
        
        <h2 className="text-2xl font-bold mb-4 text-purple-700">VI. A MediQuo compartilha as informações que coleta?</h2>
        
        <p className="mb-4">
          A MediQuo só compartilhará seus dados pessoais com terceiros quando for necessário para fornecer nossos serviços, isto é, quando você nos solicitar algo ao qual devemos responder ou quando formos legalmente obrigados a fazê-lo. Em termos gerais, a informação só será partilhada quando for estritamente necessária para a finalidade em causa, cumprindo todas as obrigações e garantias legais para o efeito, pelo que a MediQuo pode partilhar informação com:
        </p>
        
        <ul className="list-disc ml-6 mb-4">
          <li>Medipremium Servicios Médicos S. L.</li>
          <li>As ferramentas que a MediQuo contratou para ajudá-lo na prestação de serviços, tais como exemplificadamente, Amazon Web Services.</li>
        </ul>
        
        <p className="mb-4">
          Além disso, em alguns casos, a lei pode exigir que os dados pessoais sejam divulgados a órgãos públicos ou outras partes, apenas o estritamente necessário para cumprir tais obrigações legais.
        </p>
        
        <p className="mb-4">
          Em qualquer caso, os dados dos Usuários MediQuo são armazenados em servidores AWS localizados na Europa. A MediQuo afirma que estes servidores cumprem a legislação aplicável em matéria de Proteção de Dados e os compromissos estabelecidos nesta Política de Privacidade de Dados.
        </p>
        
        <p className="mb-4">
          Em razão da transferência internacional dos dados, informa-se que tal se fundamenta no art. 33, IX c/c art. 7 º, V, da Lei nº 13.079/2018, uma vez ser necessário tal envio para os servidores internacionais para fins de realização da prestação de serviço contratada ou para melhor prover a segurança dos dados coletados pela MediQuo. Além disso, nos casos de aquisição para revenda ou concessão de benefícios para empregados, o Controlador, ciente disso e quando necessária autorização específica para tal, deverá especificar tal informação para o respectivo Titular dos dados.
        </p>
        
        <p className="mb-6">
          Em casos de compartilhamento com parceiros para demais serviços além da Telemedicina, tal operação será realizada apenas mediante autorização expressa do usuário ao aceitar os termos e condições para uso do serviço escolhido.
        </p>
        
        <h2 className="text-2xl font-bold mb-4 text-purple-700">VII. Acesso ao Histórico Médico e chats históricos pelo usuário profissional (dados sensíveis)</h2>
        
        <p className="mb-4">
          O usuário aceita expressamente que ao iniciar um chat com um usuário profissional, poderá ter acesso ao Histórico Médico e aos chats históricos gerados entre o usuário e os usuários profissionais, para que os usuários profissionais possam consultá-los, a fim de garantir o correto fornecimento do médico do serviço, bem como tenham informações sobre o histórico de saúde do paciente para fins de oferecimento da melhor orientação.
        </p>
        
        <p className="mb-4">
          Quando o usuário consultar um profissional médico pela primeira vez, será necessária a confirmação prévia da autorização para que ele possa acessar o histórico médico para prestar o serviço corretamente.
        </p>
        
        <p className="mb-6">
          Determinados documentos do usuário, tal como informações médicas (prontuários, históricos, dentre outros previstos na legislação) não poderão ser descartados antes do prazo legal determinado, tal como previsto na Lei 13.787/2018 e suas posteriores alterações.
        </p>
        
        <h2 className="text-2xl font-bold mb-4 text-purple-700">VIII. Quais direitos os usuários têm?</h2>
        
        <p className="mb-4">
          Exceto nos casos de contratação de consultas avulsas, as informações e os dados fornecidos pelo usuário estarão sempre disponíveis em sua conta de usuário e poderão ser modificados por ele através da opção editar perfil.
        </p>
        
        <p className="mb-4">
          Nos casos de contratação avulsa de consultas, o usuário poderá ter acesso às informações retidas pela MediQuo por meio do canal de atendimento e suporte.
        </p>
        
        <p className="mb-4">
          Cada usuário, quando cumprido os requisitos de acesso, poderá acessar o seu perfil e completá-lo e/ou editá-lo conforme julgar apropriado.
        </p>
        
        <p className="mb-4">
          O Usuário poderá exercer os seguintes direitos reconhecidos na LGPD contra o Controlador de Dados:
        </p>
        
        <ul className="list-disc ml-6 mb-4 space-y-2">
          <li>Confirmação do existência do tratamento;</li>
          <li>Acceso para os dados;</li>
          <li>Retificação de dados incompletos, imprecisos ou desatualizados;</li>
          <li>Anonimização, bloqueio ou exclusão dados desnecessários, excessivos ou tratados em violação do disposto na Lei;</li>
          <li>Portabilidade dos dados a outro fornecedor de serviços ou produtos, mediante solicitação expressa, de acordo com a regulamentação da autoridade nacional, sem prejuízo dos segredos comercial e industrial;</li>
          <li>Eliminação de dados pessoais tratados com consentimento do interessado, ressalvadas as hipóteses previstas no art. 16 da Lei;</li>
          <li>Informações sobre o entidades públicas e privadas com quem o responsável pelo tratamento compartilhou os dados;</li>
          <li>Informações sobre a possibilidade de não dar consentimento e sobre as consequências da recusa;</li>
          <li>Revogação de consentimento, nos termos do art. 8º da Lei;</li>
          <li>Dentre outros previstos na legislação e normas correlatas.</li>
        </ul>
        
        <p className="mb-4">
          Nos casos de contratação direta da MediQuo (plano ou consulta avulsa), o usuário poderá exercer seus direitos mediante comunicação escrita dirigida ao e-mail dpo@mediquo.com.br, sugerindo a prestação das seguintes informações para fins de promover a celeridade do atendimento:
        </p>
        
        <ol className="list-decimal ml-6 mb-4 space-y-2">
          <li>Nome, sobrenome do Usuário, cópia do documento de identificação como Titular ou procuração de representante deste.</li>
          <li>Solicite com os motivos específicos da solicitação ou informação que deseja acessar.</li>
          <li>Endereço para fins de notificação.</li>
          <li>Data e assinatura do requerente.</li>
          <li>Qualquer documento que comprove o pedido requerido.</li>
        </ol>
        
        <p className="mb-4">
          Em casos do uso da MediQuo como um benefício concedido pela empresa empregadora, informamos que qualquer solicitação deverá ser encaminhada diretamente ao empregador, o qual será o Controlador dos dados, para que seja providenciado a avaliação e atendimento do pedido.
        </p>
        
        <p className="mb-4">
          O exercício destes direitos é totalmente gratuito. Uma vez recebida a solicitação, a MediQuo analisará se foram fornecidas todas as informações necessárias ao seu processamento, bem como a legitimidade e relevância da solicitação.
        </p>
        
        <p className="mb-4">
          Se não for pertinente ou se, devido ao caso concreto, o exercício do direito solicitado não puder ser concedido, notificará o interessado para que possa apresentar as reclamações correspondentes.
        </p>
        
        <p className="mb-6">
          O exercício dos direitos realizar-se-á sempre nos prazos legalmente estabelecidos, salvo se por problemas técnicos cuja resolução esteja fora do nosso alcance, os mesmos não possam ser realizados. De qualquer forma, o usuário receberá uma notificação sobre isso.
        </p>
        
        <h2 className="text-2xl font-bold mb-4 text-purple-700">IX. Como protegemos os dados do usuário?</h2>
        
        <p className="mb-4">
          A MediQuo adotou as medidas necessárias para manter o nível de segurança exigido, de acordo com a natureza dos dados pessoais tratados e as circunstâncias do tratamento, a fim de evitar, na medida do possível e sempre de acordo com o estado da técnica, a sua alteração, perda, tratamento ou acesso não autorizado e, em qualquer caso, aplicará as medidas técnicas e/ou organizacionais necessárias para garantir o correto tratamento dos dados pessoais.
        </p>
        
        <p className="mb-4">
          O dado é transmitido por meio criptografado e resta armazenada em servidores da AWS, o qual possui os principais mecanismos avançados de proteção.
        </p>
        
        <p className="mb-4">
          Além disso, os dados são tratados de maneira sigilosa e somente serão divulgados para terceiros que possuam relação com a prestação de serviço. Para demais terceiros não envolvidos, tal divulgação apenas ocorrerá mediante determinação judicial ou administrativa, autorização do titular ou se tal informação tenha se tornado pública sem que a MediQuo tenha tido participação em tal processo.
        </p>
        
        <p className="mb-4">
          Em vista disso, é imprescindível que, por parte do usuário, se tenha precaução quanto à preservação da senha personalíssima fornecida, bem como mantenha seu aparelho íntegro e livre de malwares.
        </p>
        
        <p className="mb-6">
          Eventuais terceiros e parceiros que possuam relação com a prestação de serviço possuem cláusulas contratuais determinando obrigações de confidencialidade e cuidados específicos para a preservação da privacidade do usuário.
        </p>
        
        <h2 className="text-2xl font-bold mb-4 text-purple-700">X. Dados sobre menores</h2>
        
        <p className="mb-4">
          Para utilizar o aplicativo MediQuo, o usuário deve ser maior de idade e não ter quaisquer limitações na sua capacidade de agir.
        </p>
        
        <p className="mb-4">
          Em determinados casos, os usuários poderão utilizar a ferramenta para realizar consulta de seus dependentes menores de idade. Para tais situações, será coletada a autorização expressa do responsável para fins de continuidade no atendimento.
        </p>
        
        <p className="mb-6">
          A MediQuo poderá armazenar dados pessoais de menores quando estes tenham sido fornecidos diretamente pelos seus pais ou por quem tenha autoridade parental sobre o menor. Estes dados serão recolhidos com a finalidade e legitimidade de promover o atendimento de saúde.
        </p>
        
        <h2 className="text-2xl font-bold mb-4 text-purple-700">XI. Legislação aplicável</h2>
        
        <p className="mb-6">
          As relações entre a MediQuo e os usuários decorrentes da contratação de serviços será aplicada a legislação brasileira, com expressa submissão das partes à jurisdição dos tribunais do domicílio do usuário.
        </p>
        
        <h2 className="text-2xl font-bold mb-4 text-purple-700">XII. Contato</h2>
        
        <p className="mb-4">
          Se você precisar entrar em contato conosco, pode nos escrever no logradouro da empresa indicada nestes Termos ou nos enviar um e-mail para <a href="mailto:dpo@mediquo.com.br" className="text-purple-600 hover:underline">dpo@mediquo.com.br</a> (Leandro Cazeiro - DPO)
        </p>
        
        <p className="text-sm text-gray-600 mt-8">
          Última modificação: junho de 2025
        </p>
      </div>
    </div>
    </>
  )
}