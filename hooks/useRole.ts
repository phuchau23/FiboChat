"use client"

import { useEffect, useState } from "react"
import { getAllRoles, createRole, updateRole, deleteRole } from "@/lib/api/services/fetchRole"
import type { Role } from "@/mock/roles"

export function useRole() {
  const [data, setData] = useState<Role[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getAllRoles()
      setData(result.filter((r) => !r.isDeleted))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch roles")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const create = async (role: Omit<Role, "RoleID" | "CreatedAt" | "isDeleted">) => {
    try {
      const newRole = await createRole({ ...role, isDeleted: false })
      setData([...data, newRole])
      return newRole
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create role")
      throw err
    }
  }

  const update = async (id: string, role: Partial<Role>) => {
    try {
      const updated = await updateRole(id, role)
      if (updated) {
        setData(data.map((r) => (r.RoleID === id ? updated : r)))
      }
      return updated
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update role")
      throw err
    }
  }

  const remove = async (id: string) => {
    try {
      await deleteRole(id)
      setData(data.map((r) => (r.RoleID === id ? { ...r, isDeleted: true } : r)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete role")
      throw err
    }
  }

  return { data, loading, error, create, update, remove, refetch: fetchData }
}
