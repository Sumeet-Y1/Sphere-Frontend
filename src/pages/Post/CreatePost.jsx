import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

const TYPE_CONFIG = {
  TEXT:  { label: 'Text',  icon: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg> },
  IMAGE: { label: 'Image', icon: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
  LINK:  { label: 'Link',  icon: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg> },
  MEDIA: { label: 'Media', icon: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" /></svg> },
}

export default function CreatePost() {
  const [form, setForm] = useState({ title: '', content: '', type: 'TEXT', communityId: '', imageUrl: '', linkUrl: '' })
  const [communities, setCommunities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // media state
  const [mediaMode, setMediaMode] = useState('photo') // 'photo' or 'video'
  const [photoFiles, setPhotoFiles] = useState([]) // File objects
  const [photoPreviews, setPhotoPreviews] = useState([]) // preview URLs
  const [videoFile, setVideoFile] = useState(null)
  const [videoPreview, setVideoPreview] = useState(null)
  const [uploadingMedia, setUploadingMedia] = useState(false)
  const [uploadedPhotoUrls, setUploadedPhotoUrls] = useState([])
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState(null)

  const photoInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => { fetchCommunities() }, [])

  const fetchCommunities = async () => {
    try {
      const res = await api.get('/communities')
      setCommunities(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + photoFiles.length > 3) {
      setError('Maximum 3 photos allowed!')
      return
    }
    // validate size
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        setError(`${file.name} exceeds 5MB limit!`)
        return
      }
    }
    setError('')
    const newFiles = [...photoFiles, ...files]
    setPhotoFiles(newFiles)
    const newPreviews = newFiles.map(f => URL.createObjectURL(f))
    setPhotoPreviews(newPreviews)
    setUploadedPhotoUrls([]) // reset uploaded urls
  }

  const handleVideoSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 20 * 1024 * 1024) {
      setError('Video exceeds 20MB limit!')
      return
    }
    setError('')
    setVideoFile(file)
    setVideoPreview(URL.createObjectURL(file))
    setUploadedVideoUrl(null)
  }

  const removePhoto = (index) => {
    const newFiles = photoFiles.filter((_, i) => i !== index)
    const newPreviews = photoPreviews.filter((_, i) => i !== index)
    setPhotoFiles(newFiles)
    setPhotoPreviews(newPreviews)
    setUploadedPhotoUrls([])
  }

  const removeVideo = () => {
    setVideoFile(null)
    setVideoPreview(null)
    setUploadedVideoUrl(null)
  }

  const uploadMedia = async () => {
    setUploadingMedia(true)
    setError('')
    try {
      if (mediaMode === 'photo' && photoFiles.length > 0) {
        const formData = new FormData()
        photoFiles.forEach(f => formData.append('files', f))
        const res = await api.post('/posts/upload/photos', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        setUploadedPhotoUrls(res.data.data)
        return res.data.data
      } else if (mediaMode === 'video' && videoFile) {
        const formData = new FormData()
        formData.append('file', videoFile)
        const res = await api.post('/posts/upload/video', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        setUploadedVideoUrl(res.data.data)
        return res.data.data
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload media')
      return null
    } finally {
      setUploadingMedia(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let mediaUrls = uploadedPhotoUrls
      let mediaType = null
      let videoUrl = uploadedVideoUrl

      // upload media if not already uploaded
      if (form.type === 'MEDIA') {
        if (mediaMode === 'photo' && photoFiles.length > 0 && uploadedPhotoUrls.length === 0) {
          const urls = await uploadMedia()
          if (!urls) { setLoading(false); return }
          mediaUrls = urls
          mediaType = 'PHOTO'
        } else if (mediaMode === 'video' && videoFile && !uploadedVideoUrl) {
          const url = await uploadMedia()
          if (!url) { setLoading(false); return }
          videoUrl = url
          mediaType = 'VIDEO'
        } else if (uploadedPhotoUrls.length > 0) {
          mediaType = 'PHOTO'
        } else if (uploadedVideoUrl) {
          mediaType = 'VIDEO'
        }
      }

      const payload = {
        ...form,
        communityId: parseInt(form.communityId),
        mediaUrls: mediaType === 'PHOTO' ? mediaUrls : null,
        mediaType: mediaType,
        imageUrl: mediaType === 'VIDEO' ? videoUrl : form.imageUrl,
      }

      const res = await api.post('/posts', payload)
      navigate(`/post/${res.data.id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          from { left: -100%; }
          to   { left: 150%; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .cp-wrap { min-height: 100vh; background: #080808; font-family: 'DM Sans', sans-serif; }
        .cp-inner { max-width: 620px; margin: 0 auto; padding: 40px 20px 80px; }

        .cp-heading { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.05s both; margin-bottom: 28px; }
        .cp-title { font-family: 'Cormorant Garamond', serif; font-weight: 300; font-size: 36px; color: #fff; letter-spacing: 0.08em; line-height: 1; }
        .cp-subtitle { font-size: 13px; color: rgba(255,255,255,0.22); margin-top: 8px; letter-spacing: 0.01em; }

        .cp-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 28px; animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.12s both; }

        .type-tabs { display: flex; gap: 6px; margin-bottom: 26px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 4px; }
        .type-tab { flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px; padding: 8px 12px; border-radius: 7px; border: none; background: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 400; letter-spacing: 0.02em; color: rgba(255,255,255,0.3); transition: color 0.2s, background 0.2s; }
        .type-tab:hover { color: rgba(255,255,255,0.65); }
        .type-tab.active { background: rgba(255,255,255,0.09); color: #fff; font-weight: 500; }

        .cp-form { display: flex; flex-direction: column; gap: 20px; }

        .field-label { display: block; font-size: 10.5px; font-weight: 500; letter-spacing: 0.13em; text-transform: uppercase; color: rgba(255,255,255,0.38); margin-bottom: 9px; font-family: 'DM Sans', sans-serif; }

        .glass-input, .glass-select, .glass-textarea { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); color: #fff; padding: 13px 16px; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color 0.22s, background 0.22s, box-shadow 0.22s; }
        .glass-input::placeholder, .glass-textarea::placeholder { color: rgba(255,255,255,0.16); }
        .glass-input:hover, .glass-select:hover, .glass-textarea:hover { border-color: rgba(255,255,255,0.18); }
        .glass-input:focus, .glass-select:focus, .glass-textarea:focus { border-color: rgba(255,255,255,0.45); background: rgba(255,255,255,0.07); box-shadow: 0 0 0 3px rgba(255,255,255,0.04); }

        .glass-select { appearance: none; -webkit-appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 16px center; padding-right: 40px; cursor: pointer; color: rgba(255,255,255,0.7); }
        .glass-select option { background: #111; color: #fff; }
        .glass-textarea { resize: none; line-height: 1.65; }

        .char-hint { text-align: right; font-size: 11px; color: rgba(255,255,255,0.18); margin-top: 6px; font-family: 'DM Sans', sans-serif; }
        .cp-rule { height: 1px; background: rgba(255,255,255,0.05); margin: 4px 0; }

        /* Media mode toggle */
        .media-toggle { display: flex; gap: 6px; margin-bottom: 16px; }
        .media-toggle-btn { flex: 1; padding: 9px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); background: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 12px; color: rgba(255,255,255,0.35); transition: all 0.2s; }
        .media-toggle-btn:hover { color: rgba(255,255,255,0.7); border-color: rgba(255,255,255,0.15); }
        .media-toggle-btn.active { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); color: #fff; }

        /* Upload zone */
        .upload-zone { border: 1px dashed rgba(255,255,255,0.12); border-radius: 12px; padding: 28px; text-align: center; cursor: pointer; transition: border-color 0.2s, background 0.2s; }
        .upload-zone:hover { border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.02); }

        /* Photo grid */
        .photo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 12px; }
        .photo-item { position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); }
        .photo-item img { width: 100%; height: 100%; object-fit: cover; }
        .photo-remove { position: absolute; top: 4px; right: 4px; background: rgba(0,0,0,0.7); border: none; border-radius: 50%; width: 22px; height: 22px; cursor: pointer; color: #fff; font-size: 12px; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
        .photo-remove:hover { background: rgba(255,60,60,0.8); }

        /* Video preview */
        .video-preview { position: relative; border-radius: 10px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); margin-top: 12px; }
        .video-preview video { width: 100%; max-height: 240px; object-fit: cover; display: block; }
        .video-remove { position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.7); border: none; border-radius: 50%; width: 28px; height: 28px; cursor: pointer; color: #fff; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
        .video-remove:hover { background: rgba(255,60,60,0.8); }

        /* Upload btn */
        .upload-btn { width: 100%; padding: 11px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: rgba(255,255,255,0.6); font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; transition: all 0.2s; }
        .upload-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .upload-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .upload-btn.uploaded { border-color: rgba(100,255,150,0.3); color: rgba(100,255,150,0.8); background: rgba(100,255,150,0.05); }

        /* Buttons */
        .btn-row { display: flex; gap: 10px; padding-top: 4px; }
        .btn-cancel { flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 400; padding: 13px; border-radius: 10px; cursor: pointer; transition: background 0.2s, color 0.2s, border-color 0.2s; }
        .btn-cancel:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.8); border-color: rgba(255,255,255,0.14); }
        .btn-submit { flex: 1; background: #fff; color: #000; font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 14px; letter-spacing: 0.04em; padding: 13px; border-radius: 10px; border: none; cursor: pointer; position: relative; overflow: hidden; transition: transform 0.2s ease, box-shadow 0.25s ease; }
        .btn-submit::before { content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%; background: linear-gradient(90deg, transparent, rgba(0,0,0,0.07), transparent); }
        .btn-submit:hover::before { animation: shimmer 0.55s ease forwards; }
        .btn-submit:hover { transform: translateY(-1px); box-shadow: 0 10px 36px rgba(255,255,255,0.18); }
        .btn-submit:active { transform: translateY(0); box-shadow: none; }
        .btn-submit:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }

        .cp-error { background: rgba(255,60,60,0.08); border: 1px solid rgba(255,80,80,0.25); color: rgba(255,200,200,0.9); padding: 11px 15px; border-radius: 10px; margin-bottom: 20px; font-size: 13px; display: flex; gap: 8px; align-items: center; font-family: 'DM Sans', sans-serif; animation: fadeUp 0.4s ease both; }
      `}</style>

      <div className="cp-wrap">
        <div className="cp-inner">

          <div className="cp-heading">
            <h1 className="cp-title">Create Post</h1>
            <p className="cp-subtitle">Share something with your community</p>
          </div>

          {error && <div className="cp-error"> {error}</div>}

          <div className="cp-card">

            {/* Type tabs */}
            <div className="type-tabs">
              {Object.entries(TYPE_CONFIG).map(([type, { label, icon }]) => (
                <button
                  key={type}
                  type="button"
                  className={`type-tab${form.type === type ? ' active' : ''}`}
                  onClick={() => setForm({ ...form, type })}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="cp-form">

              {/* Community */}
              <div>
                <label className="field-label">Community</label>
                <select
                  value={form.communityId}
                  onChange={(e) => setForm({ ...form, communityId: e.target.value })}
                  className="glass-select"
                  required
                >
                  <option value="">Select a community</option>
                  {communities.map(c => (
                    <option key={c.id} value={c.id}>s/{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="field-label">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="glass-input"
                  placeholder="An interesting title..."
                  maxLength={300}
                  required
                />
                <p className="char-hint">{form.title.length} / 300</p>
              </div>

              {/* TEXT */}
              {form.type === 'TEXT' && (
                <div>
                  <label className="field-label">Content</label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className="glass-textarea"
                    placeholder="Share your thoughts..."
                    rows={6}
                  />
                </div>
              )}

              {/* IMAGE */}
              {form.type === 'IMAGE' && (
                <div>
                  <label className="field-label">Image URL</label>
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    className="glass-input"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              )}

              {/* LINK */}
              {form.type === 'LINK' && (
                <div>
                  <label className="field-label">Link URL</label>
                  <input
                    type="url"
                    value={form.linkUrl}
                    onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                    className="glass-input"
                    placeholder="https://example.com"
                  />
                </div>
              )}

              {/* MEDIA */}
              {form.type === 'MEDIA' && (
                <div>
                  <label className="field-label">Media</label>

                  {/* Photo / Video toggle */}
                  <div className="media-toggle">
                    <button
                      type="button"
                      className={`media-toggle-btn${mediaMode === 'photo' ? ' active' : ''}`}
                      onClick={() => { setMediaMode('photo'); setVideoFile(null); setVideoPreview(null); setUploadedVideoUrl(null) }}
                    >
                      🖼️ Photos (max 3 · 5MB each)
                    </button>
                    <button
                      type="button"
                      className={`media-toggle-btn${mediaMode === 'video' ? ' active' : ''}`}
                      onClick={() => { setMediaMode('video'); setPhotoFiles([]); setPhotoPreviews([]); setUploadedPhotoUrls([]) }}
                    >
                      🎥 Video (max 1 · 20MB)
                    </button>
                  </div>

                  {/* Photo upload */}
                  {mediaMode === 'photo' && (
                    <>
                      {photoFiles.length < 3 && (
                        <div
                          className="upload-zone"
                          onClick={() => photoInputRef.current.click()}
                        >
                          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', marginBottom: '4px' }}>
                            📷 Click to select photos
                          </p>
                          <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: '11px' }}>
                            {photoFiles.length}/3 selected · Max 5MB each
                          </p>
                          <input
                            ref={photoInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            style={{ display: 'none' }}
                            onChange={handlePhotoSelect}
                          />
                        </div>
                      )}

                      {photoPreviews.length > 0 && (
                        <div className="photo-grid">
                          {photoPreviews.map((src, i) => (
                            <div key={i} className="photo-item">
                              <img src={src} alt="" />
                              <button
                                type="button"
                                className="photo-remove"
                                onClick={() => removePhoto(i)}
                              >✕</button>
                            </div>
                          ))}
                        </div>
                      )}

                      {photoFiles.length > 0 && (
                        <button
                          type="button"
                          className={`upload-btn ${uploadedPhotoUrls.length > 0 ? 'uploaded' : ''}`}
                          onClick={uploadMedia}
                          disabled={uploadingMedia || uploadedPhotoUrls.length > 0}
                          style={{ marginTop: '12px' }}
                        >
                          {uploadingMedia ? '⏳ Uploading...' : uploadedPhotoUrls.length > 0 ? '✅ Photos uploaded!' : '⬆️ Upload Photos'}
                        </button>
                      )}
                    </>
                  )}

                  {/* Video upload */}
                  {mediaMode === 'video' && (
                    <>
                      {!videoFile && (
                        <div
                          className="upload-zone"
                          onClick={() => videoInputRef.current.click()}
                        >
                          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', marginBottom: '4px' }}>
                            🎬 Click to select video
                          </p>
                          <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: '11px' }}>
                            Max 20MB · MP4, MOV, AVI
                          </p>
                          <input
                            ref={videoInputRef}
                            type="file"
                            accept="video/*"
                            style={{ display: 'none' }}
                            onChange={handleVideoSelect}
                          />
                        </div>
                      )}

                      {videoPreview && (
                        <div className="video-preview">
                          <video src={videoPreview} controls />
                          <button
                            type="button"
                            className="video-remove"
                            onClick={removeVideo}
                          >✕</button>
                        </div>
                      )}

                      {videoFile && (
                        <button
                          type="button"
                          className={`upload-btn ${uploadedVideoUrl ? 'uploaded' : ''}`}
                          onClick={uploadMedia}
                          disabled={uploadingMedia || !!uploadedVideoUrl}
                          style={{ marginTop: '12px' }}
                        >
                          {uploadingMedia ? '⏳ Uploading...' : uploadedVideoUrl ? '✅ Video uploaded!' : '⬆️ Upload Video'}
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}

              <div className="cp-rule" />

              <div className="btn-row">
                <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={loading || uploadingMedia}>
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <svg style={{ animation: 'spin 1s linear infinite', width: 15, height: 15 }} viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }} />
                        <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" style={{ opacity: 0.75 }} />
                      </svg>
                      Posting...
                    </span>
                  ) : 'Post →'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  )
}