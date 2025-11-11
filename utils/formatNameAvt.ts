type RawProfile = {
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  phoneNumber: string | null;
  studentID?: string | null;
  avatarUrl: string | null;
  sex?: string | null;
  address?: string | null;
  dateOfBirth?: string | null;
};

function stripDiacritics(s?: string | null) {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function firstLetter(s?: string | null) {
  const t = stripDiacritics(s).trim();
  return t ? t[0] : "";
}

function getDisplayName(p?: RawProfile | null) {
  const first = (p?.firstname ?? "").trim();
  const last = (p?.lastname ?? "").trim();
  const full = `${first} ${last}`.replace(/\s+/g, " ").trim();
  return full || "—";
}

function getInitials(p?: RawProfile | null) {
  // VN-friendly: ưu tiên (LastName)(FirstName)
  const a = firstLetter(p?.lastname);
  // nếu firstname có nhiều từ, vẫn lấy chữ đầu của cụm
  const b = firstLetter(p?.firstname);
  const initials = (a + b).toUpperCase();
  return initials || "US";
}

export { getDisplayName, getInitials };
