import { Partitioners } from 'kafkajs';
import { ConfigService } from '@nestjs/config';

export const getKafkaConfig = (configService: ConfigService) => ({
  client: {
    clientId: configService.get('KAFKA_CLIENT_ID'),
    brokers: configService.get<string>('KAFKA_BROKERS').split(','),
  },
  consumer: {
    groupId: configService.get('KAFKA_CONSUMER_GROUP_ID'),
  },
  producer: {
    createPartitioner: Partitioners.LegacyPartitioner,
  },
});
