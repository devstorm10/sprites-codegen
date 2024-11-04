import { Navigate, Route, Routes } from 'react-router-dom'

import AppLayout from '@/layouts/AppLayout'
import EditorPage from '@/pages/EditorPage'
import EditorLayout from './layouts/EditorLayout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route element={<EditorLayout />}>
          <Route
            index
            element={
              <Navigate to="/edit/default_project/default_context" replace />
            }
          />
          <Route path="edit/:project_id/:agent_id" element={<EditorPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
