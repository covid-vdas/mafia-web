import { useState } from 'react'
import Head from 'next/head'
import Layout from '../components/layout'
import useAccount from '../lib/useAccount'
import fetchJson from '../lib/fetchJson'

const Login = () => {
    const [message, showMessage] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { mutateAccount } = useAccount({
        redirectTo: '/',
        redirectIfFound: true,
    })

    const login = async (e) => {
        e.preventDefault()

        if (!email || !password) {
            showMessage('Email and password cannot be empty!')
            return
        }

        try {
            mutateAccount(
                await fetchJson('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email, password
                    })
                })
            )
        } catch (err) {
            console.log(err)
            showMessage('Wrong email or password!')
            setPassword('')
        }
    }

    return <Layout>
        <Head>
            <title>Login</title>
        </Head>
        <form className="border p-5" style={{ width: '500px' }} onSubmit={login}>
            <h3 className="d-flex mb-4">LOGIN</h3>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                    onChange={e => setEmail(e.target.value)}
                    value={email} name="email" type="email" className="form-control" id="email" />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                    onChange={e => setPassword(e.target.value)}
                    value={password} name="password" type="password" className="form-control" id="password" />
            </div>
            {message && <p className="text-danger">{message}</p>}
            <div className="mt-4">
                <button type="submit" className="btn btn-primary me-2">Login</button>
                <a className="btn btn-outline-dark">
                    <i className="bi bi-google me-2" />Continue with Google
                </a>
            </div>
        </form>
    </Layout>
}

export default Login