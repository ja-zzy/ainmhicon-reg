"use client"

import { supabase } from './utils/supabaseClient'
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Attendee } from "./utils/types";
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const currentUser = session?.user || null

      if (!currentUser) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('attendees')
        .select('*')
        .eq('user_id', currentUser.id)
        .single()

      const attendee = data?.[0]

      if (!attendee?.first_name) {
        router.push('/user-details')
        return
      }
      router.push('/dashboard')
    }

    init()
  }, [])


  return (
    <p>Loading...</p>
  );
}
