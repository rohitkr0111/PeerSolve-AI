import api from '@/lib/api';
import type { MentorRequestDto, MentorResponseDto } from '@/types/mentor';

/**
 * Calls the backend AI mentor analysis endpoint.
 */
export async function analyzeMentor(request: MentorRequestDto): Promise<MentorResponseDto> {
  const { data } = await api.post<MentorResponseDto>('/api/mentor/analyze', request);
  return data;
}
