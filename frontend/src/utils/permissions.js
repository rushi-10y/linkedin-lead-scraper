import { ROLES } from './constants.js';

const ROLE_HIERARCHY = Object.freeze({
  [ROLES.AGENT]: 1,
  [ROLES.MANAGER]: 2,
  [ROLES.ADMIN]: 3
});

const hasPermission = (userRole, requiredRole) => {
  if (!userRole || !requiredRole) return false;

  const userLevel = ROLE_HIERARCHY[userRole];
  const requiredLevel = ROLE_HIERARCHY[requiredRole];

  if (!userLevel || !requiredLevel) return false;

  return userLevel >= requiredLevel;
};

const canEditLead = (userRole) =>
  hasPermission(userRole, ROLES.AGENT);

const canDeleteLead = (userRole) =>
  hasPermission(userRole, ROLES.MANAGER);

const canManageUsers = (userRole) =>
  hasPermission(userRole, ROLES.ADMIN);

export {
  hasPermission,
  canEditLead,
  canDeleteLead,
  canManageUsers
};
