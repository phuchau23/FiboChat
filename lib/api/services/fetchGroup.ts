import apiService from "../core";

// ==== INTERFACES ==== //
export interface Group {
  id: string;
  classId: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Member {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  roleInClass: string;
  status: string;
}

// Kế thừa Group, thêm members
export interface GroupWithMembers extends Group {
  members: Member[];
}

export interface GroupResponse {
  statusCode: number;
  code: string;
  message: string;
  data: {
    items: Group[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

// ==== API SERVICE ==== //
export const fetchGroups = {
  // GET /api/groups/class/{classId}
  getByClassId: async (classId: string): Promise<GroupResponse> => {
    const res = await apiService.get<GroupResponse>(`/auth/api/groups/class/${classId}`);
    return res.data;
  },

  // GET /api/groups/{groupId}/members
  getMembersByGroupId: async (groupId: string): Promise<Member[]> => {
    const res = await apiService.get<{ data: Member[] }>(`/auth/api/groups/${groupId}/members`);
    return res.data.data || [];
  },

  // GET /api/groups/class/{classId} kèm members
  getByClassIdWithMembers: async (classId: string): Promise<GroupWithMembers[]> => {
    const groupsRes = await fetchGroups.getByClassId(classId);
    const groups = groupsRes.data.items;

    const groupsWithMembers: GroupWithMembers[] = await Promise.all(
      groups.map(async (g) => {
        const members = await fetchGroups.getMembersByGroupId(g.id);
        return { ...g, members };
      })
    );

    return groupsWithMembers;
  },
};
