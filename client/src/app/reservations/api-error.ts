export function getApiErrorMessages(error: unknown): string[] {
  if (!isRecord(error)) {
    return ['An unexpected error occurred. Please try again.'];
  }

  const body = isRecord(error['error']) ? error['error'] : error;
  const validationErrors = body['errors'];

  if (isRecord(validationErrors)) {
    const messages = Object.values(validationErrors).flatMap((value) =>
      Array.isArray(value)
        ? value.filter((message): message is string => typeof message === 'string')
        : [],
    );

    if (messages.length > 0) {
      return messages;
    }
  }

  for (const key of ['detail', 'title', 'message']) {
    if (typeof body[key] === 'string' && body[key].trim()) {
      return [body[key]];
    }
  }

  return ['Unable to complete the request. Please try again.'];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
