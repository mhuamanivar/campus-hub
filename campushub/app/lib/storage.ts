export interface Registration {
  eventId: number;
  userEmail: string;
}

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const getRegistrations = (): Registration[] => {
  const data = localStorage.getItem("registrations");
  return data ? JSON.parse(data) : [];
};

export const saveRegistration = (
  registration: Registration
) => {
  const registrations = getRegistrations();

  registrations.push(registration);

  localStorage.setItem(
    "registrations",
    JSON.stringify(registrations)
  );
};