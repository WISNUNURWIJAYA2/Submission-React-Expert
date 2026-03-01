import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// import LoadingBar from '@dimasmds/react-redux-loading-bar';
import {
  asyncLogin,
  asyncRegisterUser,
  asyncUnsetAuthUser,
  asyncPopulateUsersAndThreads,
  asyncGetThreadDetail,
  asyncAddThread,
  asyncAddComment,
} from './states';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const onLogin = (e) => {
    e.preventDefault();
    dispatch(asyncLogin({ email, password }));
  };

  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={onLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Masuk</button>
      </form>
      <p>
        Belum punya akun? <Link to="/register">Daftar</Link>
      </p>
    </div>
  );
};

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onRegister = (e) => {
    e.preventDefault();
    dispatch(asyncRegisterUser({ name, email, password }));
    navigate('/');
  };

  return (
    <div className="card">
      <h2>Daftar Akun</h2>
      <form onSubmit={onRegister}>
        <input
          type="text"
          placeholder="Nama"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Daftar</button>
      </form>
      <p>
        Sudah punya akun? <Link to="/">Login</Link>
      </p>
    </div>
  );
};

const ThreadList = () => {
  const { threads = [], users = [], authUser } = useSelector((s) => s);
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    dispatch(asyncPopulateUsersAndThreads());
  }, [dispatch]);

  const onAddThread = (e) => {
    e.preventDefault();
    dispatch(asyncAddThread({ title, body, category }));
    setTitle('');
    setBody('');
    setCategory('');
  };

  return (
    <div className="container">
      {authUser && (
        <div className="card">
          <h3>Buat Diskusi Baru</h3>
          <form onSubmit={onAddThread}>
            <input
              placeholder="Judul"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              placeholder="Kategori"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <textarea
              placeholder="Apa yang anda pikirkan?"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
            <button type="submit">Kirim</button>
          </form>
        </div>
      )}

      <h2>Diskusi Tersedia</h2>
      {threads.map((thread) => {
        const owner = users.find((user) => user.id === thread.ownerId);
        return (
          <div key={thread.id} className="card thread-item">
            <h4>
              <Link to={`/threads/${thread.id}`}>{thread.title}</Link>
            </h4>
            <p>{thread.body.substring(0, 100)}...</p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <small>
                Dibuat oleh: <b>{owner ? owner.name : 'Unknown'}</b> |{' '}
                {new Date(thread.createdAt).toLocaleDateString()}
              </small>
              <small>💬 {thread.totalComments} komentar</small>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ThreadDetail = () => {
  const { id } = useParams();
  const { threadDetail, authUser } = useSelector((s) => s);
  const dispatch = useDispatch();
  const [content, setContent] = useState('');

  useEffect(() => {
    dispatch(asyncGetThreadDetail(id));
  }, [id, dispatch]);

  const onComment = (e) => {
    e.preventDefault();
    dispatch(asyncAddComment({ content, threadId: id }));
    setContent('');
  };

  if (!threadDetail) return <p>Loading detail...</p>;

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <img
            src={threadDetail.owner.avatar}
            alt="avatar"
            style={{ width: '40px', borderRadius: '50%', marginRight: '10px' }}
          />
          <div>
            <h4 style={{ margin: 0 }}>{threadDetail.owner.name}</h4>
            <small>{new Date(threadDetail.createdAt).toLocaleString()}</small>
          </div>
        </div>
        <h2>{threadDetail.title}</h2>
        <p>{threadDetail.body}</p>
        <small>Kategori: #{threadDetail.category}</small>
        <hr />
        <h3>Komentar ({threadDetail.comments.length})</h3>
        {threadDetail.comments.map((comment) => (
          <div
            key={comment.id}
            style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <img
                src={comment.owner.avatar}
                alt="avatar"
                style={{ width: '25px', borderRadius: '50%', marginRight: '10px' }}
              />
              <b>{comment.owner.name}</b>
            </div>
            <p style={{ margin: '5px 0' }}>{comment.content}</p>
            <small>{new Date(comment.createdAt).toLocaleDateString()}</small>
          </div>
        ))}

        {authUser && (
          <form onSubmit={onComment} style={{ marginTop: '20px' }}>
            <textarea
              placeholder="Tulis komentar..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <button type="submit">Kirim Komentar</button>
          </form>
        )}
      </div>
    </div>
  );
};

function App() {
  const { authUser } = useSelector((s) => s);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !authUser) {
      dispatch(asyncPopulateUsersAndThreads());
    }
  }, [dispatch, authUser]);

  const onSignOut = () => {
    dispatch(asyncUnsetAuthUser());
    navigate('/');
  };

  return (
    <>
      {useSelector((s) => s.loadingBar?.default > 0) && (
        <div style={{ position: 'sticky', top: 0, zIndex: 100, width: '100%', height: '4px', backgroundColor: 'red' }} />
      )}
      <nav
        style={{
          padding: '15px',
          background: '#333',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Link
          to="/"
          style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}
        >
          Forum Diskusi
        </Link>
        {authUser ? (
          <div>
            <span>Halo, {authUser.name} </span>
            <button onClick={onSignOut}>Logout</button>
          </div>
        ) : (
          <Link to="/" style={{ color: '#fff' }}>
            Login
          </Link>
        )}
      </nav>

      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={authUser ? <ThreadList /> : <Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/threads/:id" element={<ThreadDetail />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
