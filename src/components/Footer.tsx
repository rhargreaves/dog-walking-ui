import React, { useEffect, useState } from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';

interface VersionInfo {
  version: string;
  buildTimestamp: string;
}

const Footer: React.FC = () => {
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVersionInfo = async () => {
      try {
        const response = await fetch('/version.json');
        if (!response.ok) {
          throw new Error('Failed to fetch version info');
        }
        const data = await response.json();
        // If the timestamp is a placeholder, replace with current time or env variable
        if (data.buildTimestamp === 'BUILD_TIMESTAMP_PLACEHOLDER') {
          data.buildTimestamp = process.env.REACT_APP_BUILD_TIMESTAMP || new Date().toISOString();
        }
        setVersionInfo(data);
      } catch (error) {
        console.error('Error fetching version info:', error);
        // Fallback to environment variable
        setVersionInfo({
          version: process.env.REACT_APP_VERSION || '1.0.0',
          buildTimestamp: process.env.REACT_APP_BUILD_TIMESTAMP || new Date().toISOString()
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVersionInfo();
  }, []);

  if (isLoading || !versionInfo) {
    return null;
  }

  const formattedDate = new Date(versionInfo.buildTimestamp).toLocaleString();

  return (
    <Box
      as="footer"
      width="100%"
      py={4}
      mt={8}
      borderTop="1px"
      borderColor="gray.200"
    >
      <Flex
        justify="center"
        direction={{ base: 'column', md: 'row' }}
        align="center"
        gap={2}
      >
        <Text fontSize="sm" color="gray.500">
          v{versionInfo.version}
        </Text>
        <Text fontSize="sm" color="gray.500" display={{ base: 'none', md: 'block' }}>
          •
        </Text>
        <Text fontSize="sm" color="gray.500">
          Built {formattedDate}
        </Text>
      </Flex>
    </Box>
  );
};

export default Footer;