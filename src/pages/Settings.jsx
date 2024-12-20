import AccountSettings from "../components/settings/AccountSettings"
import NotificationSettings from "../components/settings/NotificationSettings"
import AnalysisPreferences from "../components/settings/AnalysisPreferences"
import APIConfiguration from "../components/settings/APIConfiguration"
const Settings = () => (
  <div className="container mx-auto p-6">
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Platform Settings</h2>
      <form className="space-y-6">
        <AccountSettings />
        <NotificationSettings />
        <AnalysisPreferences />
        {/* <APIConfiguration /> */}
      </form>
    </div>
  </div>
);

export default Settings;
