import { Box, TextInput, Button, Checkbox, Tooltip } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import './UrlLoader.css';
import { useEffect, useState } from 'react';
import { apiCall } from '../../../utils/api';
import { useForm } from '@mantine/form';

export function UrlLoader() {
  const [sitemap, setSitemap] = useState(false);

const form = useForm({
    initialValues: { URL: '' },
    validate: {
      URL: (value) => {
        if (!value) {
          return 'URL is required';
        }
        if (!value.startsWith('http://') && !value.startsWith('https://')) {
          return 'URL must start with http:// or https://';
        }
        return null;
      },
    },
  });

  const handleSuccess = (values) => {
    console.log(values);
    handleUrlUpload();
  };

  const handleFail = (errors) => {
    console.log(errors);
  };

  const handleUrlUpload = () => {
    const payload = {
      website: form.values.URL,
      sitemap: sitemap,
    };
    console.log(payload);
    apiCall('/files/website', 'POST', payload)
      .then((response) => {
        console.log(response.data);
        window.location.reload();
      })
      .catch((error) => {
        console.log('Error fetching config:', error);
      });
  };

  const [focused, setFocused] = useState(false);

  return (
    <div className="urlloader">
      <Box>
        <div>
          <form onSubmit={form.onSubmit(handleSuccess, handleFail)}>
            <TextInput
              style={{ flex: '1', margin: '0 5px' }}
              icon={<IconSearch size="1rem" />}
              placeholder="https://aixplora.app"
              {...form.getInputProps('URL')}
              size={'sm'}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              inputContainer={(children) => (
                <Tooltip
                  label="By enabling the checkbox, the whole sitemap of the website will be scraped and everything will be indexed. Note: This will probably take a while!"
                  position="top-start"
                  opened={focused}
                >
                  {children}
                </Tooltip>
              )}
            />
            <div style={{ display: 'flex', gap: '10px', margin: '5px 5px' }}>
              <Checkbox
                label={'Index whole sitemap'}
                style={{ marginTop: '10px' }}
                onChange={(event) => setSitemap(event.currentTarget.checked)}
                disabled
              />
              <Button type="submit">Upload</Button>
            </div>
          </form>
        </div>
      </Box>
    </div>
  );
}

export default UrlLoader;
