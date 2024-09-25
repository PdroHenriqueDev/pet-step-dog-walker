import React, {useState} from 'react';
import {View, Text, ScrollView, Modal} from 'react-native';
import {CheckBox} from '@rneui/base';
import CustomButton from '../customButton';
import colors from '../../styles/colors';
import {useAuth} from '../../contexts/authContext';
import {useDialog} from '../../contexts/dialogContext';
import {AxiosError} from 'axios';
import {termsAcceptance} from '../../services/dogWalkerService';
import {DogWalkerApplicationStatus} from '../../interfaces/dogWalkerApplicationStatus';

export default function TermsOfService() {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {handleSetUser, user, fetchUser} = useAuth();
  const {showDialog, hideDialog} = useDialog();

  const handleAcceptTerms = async () => {
    setIsLoading(true);
    try {
      if (!user) return fetchUser();

      await termsAcceptance();

      handleSetUser({
        ...user,
        status: DogWalkerApplicationStatus.Approved,
      });
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError &&
        typeof error.response?.data?.data === 'string'
          ? error.response?.data?.data
          : 'Ocorreu um erro inesperado';
      showDialog({
        title: errorMessage,
        confirm: {
          confirmLabel: 'Entendi',
          onConfirm: () => {
            hideDialog();
          },
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal animationType="slide" transparent={false} visible={true}>
      <View className="flex-1 bg-primary px-5 pt-12 pb-5">
        <Text className="font-bold text-xl text-dark text-center mb-5">
          Termos
        </Text>

        <ScrollView className="flex-1">
          <Text className="text-base text-dark mb-3">
            Para poder aceitar passeios, você precisa ler e aceitar os termos de
            serviço da plataforma. Abaixo estão alguns pontos importantes que
            você deve estar ciente:
          </Text>

          <Text className="font-bold text-dark mb-3">Responsabilidades:</Text>
          <Text className="text-base text-dark mb-3">
            1. Como passeador de cães, você é totalmente responsável pela
            segurança do cão durante o passeio. Isso inclui garantir que o cão
            esteja seguro e protegido, e que todos os cuidados necessários sejam
            tomados para evitar acidentes.
          </Text>
          <Text className="text-base text-dark mb-3">
            2. Em caso de qualquer dano, acidente ou incidente que ocorra
            durante o passeio, você, como passeador, será responsável pelas
            consequências legais e financeiras. Isso inclui qualquer dano ao
            cão, ao tutor, a terceiros ou à propriedade.
          </Text>

          <Text className="font-bold text-dark mb-3">
            Processamento de Pagamentos:
          </Text>
          <Text className="text-base text-dark mb-3">
            3. O processamento de pagamentos será feito por nossa parceira, e
            pode levar até 30 dias para o valor ser depositado em sua conta. É
            importante notar que **30% do valor do passeio será descontado**
            como taxa de serviço da plataforma. O valor restante será
            transferido para sua conta após o processamento.
          </Text>

          <Text className="font-bold text-dark mb-3">Riscos e Segurança:</Text>
          <Text className="text-base text-dark mb-3">
            4. O passeio com cães pode envolver riscos, e é importante que você
            esteja confortável com os tipos de cães que irá passear, incluindo
            cães dominantes ou agressivos. O passeador deve avaliar se está apto
            a lidar com o comportamento do animal antes de aceitar o passeio.
            **Sugerimos que o passeador não aceite passeios com cães com os
            quais ele não se sinta confortável**, garantindo, assim, a segurança
            tanto do cão quanto dele próprio.
          </Text>

          <Text className="font-bold text-dark mb-3">
            Independência e Flexibilidade:
          </Text>
          <Text className="text-base text-dark mb-3">
            5. Não há nenhum vínculo empregatício entre você, como passeador, e
            a plataforma Pet Step. Você tem total liberdade para aceitar ou
            recusar passeios a qualquer momento, sem prejuízos ou penalizações.
            A plataforma não controla seus horários ou número de passeios
            aceitos.
          </Text>
          <Text className="text-base text-dark mb-3">
            6. Você pode realizar passeios de acordo com sua disponibilidade.
            Não há exigências mínimas de horários, número de passeios ou
            qualquer obrigatoriedade de prestação de serviços contínuos.
          </Text>

          <Text className="font-bold text-dark mb-3">
            Avaliações e Feedbacks dos Tutores:
          </Text>
          <Text className="text-base text-dark mb-3">
            7. A plataforma utiliza um sistema de notas e coleta feedback dos
            tutores de cães. Esse feedback pode influenciar diretamente sua
            continuidade como passeador na plataforma. É essencial manter um
            alto nível de educação, higiene, cortesia e profissionalismo em
            todos os passeios. Caso contrário, a plataforma se reserva o direito
            de banir passeadores que não mantenham esses padrões, com base nas
            avaliações e comportamentos reportados pelos tutores.{' '}
          </Text>

          <Text className="font-bold text-dark mb-3">
            Contribuição para Causas Animais
          </Text>
          <Text className="text-base text-dark mb-3">
            8. No Pet Step, valorizamos o impacto social e acreditamos que
            juntos podemos fazer a diferença. Uma parte do lucro da plataforma
            será destinada a ajudar cães de rua e apoiar instituições de resgate
            e cuidado de animais. No entanto, essa contribuição não interfere
            nos seus ganhos como passeador. Você receberá o valor integral
            acordado, sem nenhum desconto adicional além da taxa de serviço já
            informada. Ao colaborar conosco, você também estará ajudando a fazer
            a diferença na vida de muitos animais em necessidade!
          </Text>
        </ScrollView>

        <CheckBox
          title="Eu li e aceito os termos e condições"
          checked={termsAccepted}
          onPress={() => setTermsAccepted(!termsAccepted)}
          checkedColor={colors.secondary}
          disabled={isLoading}
        />

        <CustomButton
          label="Aceitar e continuar"
          onPress={handleAcceptTerms}
          disabled={!termsAccepted}
          backgroundColor={termsAccepted ? colors.secondary : colors.accent}
          isLoading={isLoading}
        />
      </View>
    </Modal>
  );
}
