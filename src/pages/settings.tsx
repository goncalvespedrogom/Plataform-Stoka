import SettingsSection from '../components/sections/settings';
import PlatformLayout from '../components/PlatformLayout';
import React from 'react';

function SettingsPage() {
  return <SettingsSection />;
}

SettingsPage.getLayout = function getLayout(page: React.ReactNode) {
  return <PlatformLayout>{page}</PlatformLayout>;
};

export default SettingsPage; 