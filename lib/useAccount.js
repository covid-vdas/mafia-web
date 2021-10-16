import { useEffect } from 'react'
import Router from 'next/router'
import useSWR from 'swr'

export default function useAccount({
    redirectTo = false,
    redirectIfFound = false,
} = {}) {
    const { data: account, mutate: mutateAccount } = useSWR('/api/account')

    useEffect(() => {
        // if no redirect needed, just return (example: already on /dashboard)
        // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
        if (!redirectTo || !account) return

        if (
            // If redirectTo is set, redirect if the user was not found.
            (redirectTo && !redirectIfFound && !account?.isLoggedIn) ||
            // If redirectIfFound is also set, redirect if the user was found
            (redirectIfFound && account?.isLoggedIn)
        ) {
            Router.push(redirectTo)
        }
    }, [account, redirectIfFound, redirectTo])

    return { account, mutateAccount }
}