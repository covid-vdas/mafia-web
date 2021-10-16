import Link from 'next/link'
import { useRouter } from 'next/router'
import useAccount from '../lib/useAccount'

const Header = () => {
    const router = useRouter()
    const { account, mutateAccount } = useAccount()

    const logout = async () => {
        mutateAccount(
            await fetch('/api/logout', { method: 'POST' }),
            false
        )
        router.push('/login')
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    {/* <a className="navbar-brand" href="#">Navbar</a> */}
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link href="/">
                                    <a className="nav-link active">Home</a>
                                </Link>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Demo
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                            </li>
                        </ul>
                        <div className="d-flex">
                            {!account?.isLoggedIn && <>
                                <Link href="/login">
                                    <a className="btn btn-sm btn-outline-secondary">
                                        Login
                                    </a>
                                </Link>
                            </>}
                            {account?.isLoggedIn && <>
                                <a className="btn btn-sm btn-outline-secondary me-2">
                                    <i className="bi bi-person" /> Profile
                                </a>
                                <a className="btn btn-sm btn-outline-secondary" onClick={logout}>
                                    Logout
                                </a>
                            </>}
                        </div>
                    </div>
                </div>
            </nav>
            <style jsx>{`
                nav {
                    position: fixed;
                    width: 100vw;
                }
            `}</style>
        </div>
    )
}

export default Header