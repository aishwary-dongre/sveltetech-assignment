import { useState, useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';
import Toast from '../components/Toast';

const Settings = () => {
  const { preferences, loading, savePreferences, resetPreferences } = useSettings();
  const [formData, setFormData] = useState(preferences);
  const [hasChanges, setHasChanges] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  // Update form data when preferences load
  useEffect(() => {
    setFormData(preferences);
  }, [preferences]);

  // Check for changes
  useEffect(() => {
    const changed = JSON.stringify(formData) !== JSON.stringify(preferences);
    setHasChanges(changed);
  }, [formData, preferences]);

  const handleSave = () => {
    const success = savePreferences(formData);
    if (success) {
      setToast({
        message: 'Settings saved successfully!',
        type: 'success',
        isVisible: true,
      });
      setHasChanges(false);
    } else {
      setToast({
        message: 'Failed to save settings. Please try again.',
        type: 'error',
        isVisible: true,
      });
    }
  };

  const handleReset = () => {
    const success = resetPreferences();
    if (success) {
      setFormData(preferences);
      setToast({
        message: 'Settings reset to defaults!',
        type: 'info',
        isVisible: true,
      });
      setHasChanges(false);
    }
  };

  const handleCancel = () => {
    setFormData(preferences);
    setHasChanges(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account preferences and settings</p>
      </div>

      {/* Unsaved Changes Banner */}
      {hasChanges && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg
                className="w-5 h-5 text-amber-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium text-amber-900">
                You have unsaved changes
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1 text-sm font-medium text-amber-700 hover:text-amber-900"
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Appearance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Appearance</h2>
            <p className="text-sm text-gray-600 mt-1">
              Customize how the application looks
            </p>
          </div>
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="darkMode" className="text-sm font-medium text-gray-900">
                  Dark Mode
                </label>
                <p className="text-sm text-gray-500">
                  Use dark theme throughout the application
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={formData.darkMode}
                onClick={() =>
                  setFormData({ ...formData, darkMode: !formData.darkMode })
                }
                className={`${
                  formData.darkMode ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    formData.darkMode ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage how you receive notifications
            </p>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="emailNotifications" className="text-sm font-medium text-gray-900">
                  Email Notifications
                </label>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={formData.notifications.email}
                onClick={() =>
                  setFormData({
                    ...formData,
                    notifications: {
                      ...formData.notifications,
                      email: !formData.notifications.email,
                    },
                  })
                }
                className={`${
                  formData.notifications.email ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    formData.notifications.email ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="pushNotifications" className="text-sm font-medium text-gray-900">
                  Push Notifications
                </label>
                <p className="text-sm text-gray-500">Receive push notifications in browser</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={formData.notifications.push}
                onClick={() =>
                  setFormData({
                    ...formData,
                    notifications: {
                      ...formData.notifications,
                      push: !formData.notifications.push,
                    },
                  })
                }
                className={`${
                  formData.notifications.push ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    formData.notifications.push ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="smsNotifications" className="text-sm font-medium text-gray-900">
                  SMS Notifications
                </label>
                <p className="text-sm text-gray-500">Receive notifications via text message</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={formData.notifications.sms}
                onClick={() =>
                  setFormData({
                    ...formData,
                    notifications: {
                      ...formData.notifications,
                      sms: !formData.notifications.sms,
                    },
                  })
                }
                className={`${
                  formData.notifications.sms ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    formData.notifications.sms ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
            <p className="text-sm text-gray-600 mt-1">
              Customize your experience
            </p>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-900 mb-2">
                Language
              </label>
              <select
                id="language"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ja">Japanese</option>
                <option value="zh">Chinese</option>
              </select>
            </div>

            <div>
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-900 mb-2">
                Timezone
              </label>
              <select
                id="timezone"
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
                <option value="Asia/Shanghai">Shanghai (CST)</option>
              </select>
            </div>

            <div>
              <label htmlFor="emailDigest" className="block text-sm font-medium text-gray-900 mb-2">
                Email Digest Frequency
              </label>
              <select
                id="emailDigest"
                value={formData.emailDigest}
                onChange={(e) => setFormData({ ...formData, emailDigest: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="realtime">Real-time</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="never">Never</option>
              </select>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-red-200 bg-red-50">
            <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
            <p className="text-sm text-red-700 mt-1">
              Irreversible actions
            </p>
          </div>
          <div className="px-6 py-4">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-300 rounded-lg hover:bg-red-100 transition-colors"
            >
              Reset to Default Settings
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
        <button
          onClick={handleCancel}
          disabled={!hasChanges}
          className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className="px-6 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Save Changes
        </button>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
};

export default Settings;