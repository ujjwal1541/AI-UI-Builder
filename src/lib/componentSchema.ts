export const COMPONENT_SCHEMA = {
  Button: {
    props: {
      children: { type: 'node', required: true },
      variant: { type: 'enum', values: ['primary', 'secondary', 'danger'], default: 'primary' },
      size: { type: 'enum', values: ['sm', 'md', 'lg'], default: 'md' },
      onClick: { type: 'function', required: false },
      disabled: { type: 'boolean', default: false },
      fullWidth: { type: 'boolean', default: false }
    }
  },
  Card: {
    props: {
      children: { type: 'node', required: true },
      title: { type: 'string', required: false },
      subtitle: { type: 'string', required: false },
      padding: { type: 'enum', values: ['none', 'sm', 'md', 'lg'], default: 'md' },
      shadow: { type: 'boolean', default: true }
    }
  },
  Input: {
    props: {
      value: { type: 'string', required: true },
      onChange: { type: 'function', required: true },
      placeholder: { type: 'string', required: false },
      label: { type: 'string', required: false },
      type: { type: 'enum', values: ['text', 'email', 'password', 'number'], default: 'text' },
      disabled: { type: 'boolean', default: false },
      fullWidth: { type: 'boolean', default: false },
      error: { type: 'string', required: false }
    }
  },
  Table: {
    props: {
      columns: { type: 'array', required: true },
      data: { type: 'array', required: true },
      striped: { type: 'boolean', default: false },
      hover: { type: 'boolean', default: true }
    }
  },
  Modal: {
    props: {
      isOpen: { type: 'boolean', required: true },
      onClose: { type: 'function', required: true },
      title: { type: 'string', required: false },
      children: { type: 'node', required: true },
      size: { type: 'enum', values: ['sm', 'md', 'lg', 'xl'], default: 'md' }
    }
  },
  Sidebar: {
    props: {
      items: { type: 'array', required: true },
      title: { type: 'string', required: false },
      width: { type: 'enum', values: ['sm', 'md', 'lg'], default: 'md' }
    }
  },
  Navbar: {
    props: {
      brand: { type: 'string', required: false },
      items: { type: 'array', required: false },
      actions: { type: 'node', required: false }
    }
  },
  Chart: {
    props: {
      data: { type: 'array', required: true },
      type: { type: 'enum', values: ['bar', 'line'], required: true },
      title: { type: 'string', required: false },
      height: { type: 'number', default: 300 }
    }
  }
};

export const ALLOWED_COMPONENTS = Object.keys(COMPONENT_SCHEMA);

export function getComponentDocumentation(): string {
  return JSON.stringify(COMPONENT_SCHEMA, null, 2);
}
