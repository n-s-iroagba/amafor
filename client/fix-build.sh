#!/bin/bash

echo "🔧 Fixing all build errors..."

# Step 1: Create missing useApiQuery hook
echo "📝 Creating src/hooks/useApiQuery.ts..."
mkdir -p src/hooks

cat > src/hooks/useApiQuery.ts << 'EOF'
import { useState, useEffect } from 'react';

interface UseGetOptions {
  enabled?: boolean;
}

export function useGet<T>(url: string, options?: UseGetOptions) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (options?.enabled === false) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(url);
        if (!response.ok) throw new Error(\`HTTP error! status: \${response.status}\`);
        const json = await response.json();
        setData(json);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url, options?.enabled]);

  return { data, isLoading, error, refetch: () => {} };
}

export function useDelete() {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (url: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(url, { method: 'DELETE' });
      if (!response.ok) throw new Error(\`HTTP error! status: \${response.status}\`);
      return await response.json();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading };
}
EOF

echo "✅ Created useApiQuery hook"

# Step 2: Fix react-router-dom imports
echo "📝 Fixing react-router-dom imports..."

# Fix all patterns
find ./src/app -type f -name "*.tsx" -exec sed -i \
  -e "s|import { Link, useParams, useNavigate } from 'react-router-dom';|import Link from 'next/link';\nimport { useParams } from 'next/navigation';\nimport { useRouter } from 'next/navigation';|g" \
  -e "s|import { Link, useParams } from 'react-router-dom';|import Link from 'next/link';\nimport { useParams } from 'next/navigation';|g" \
  -e "s|import { Link } from 'react-router-dom';|import Link from 'next/link';|g" \
  -e 's|const navigate = useNavigate();|const router = useRouter();|g' \
  -e 's|navigate(|router.push(|g' \
  -e 's|<Link to=|<Link href=|g' \
  {} +

echo "✅ Fixed react-router-dom imports"
echo ""
echo "🎉 All fixes applied! Now run: npm run build"
