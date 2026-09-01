// defaultLimit == maxLimit intentionally: the admin UI doesn't send limit/offset
// yet (no pagination controls), so an unrequested call must return everything up
// to the hard cap rather than silently truncating below what admins see today.
export function parsePagination(query = {}, { defaultLimit = 200, maxLimit = 200 } = {}) {
  const rawLimit = Number(query.limit);
  const limit = Number.isInteger(rawLimit) && rawLimit > 0 && rawLimit <= maxLimit ? rawLimit : defaultLimit;

  const rawOffset = Number(query.offset);
  const offset = Number.isInteger(rawOffset) && rawOffset >= 0 ? rawOffset : 0;

  return { limit, offset };
}
