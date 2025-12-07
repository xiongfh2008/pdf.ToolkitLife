#!/bin/bash

# 批量更新所有HTML页面的脚本
# 1. 替换BentoPDF为PDFToolkit
# 2. 添加语言切换器
# 3. 移除Licensing链接

echo "开始批量更新HTML页面..."

# 更新所有HTML文件中的BentoPDF引用
find . -name "*.html" -not -path "./node_modules/*" -not -path "./dist/*" -exec sed -i 's/BentoPDF/PDFToolkit/g' {} \;
find . -name "*.html" -not -path "./node_modules/*" -not -path "./dist/*" -exec sed -i 's/bentopdf/pdftoolkit/g' {} \;
find . -name "*.html" -not -path "./node_modules/*" -not -path "./dist/*" -exec sed -i 's/Bento PDF/PDFToolkit/g' {} \;

echo "✅ 已替换所有BentoPDF引用"

# 更新favicon引用
find . -name "*.html" -not -path "./node_modules/*" -not -path "./dist/*" -exec sed -i 's|images/favicon.svg|images/pdftoolkit-logo.svg|g' {} \;
find . -name "*.html" -not -path "./node_modules/*" -not -path "./dist/*" -exec sed -i 's|/images/favicon.svg|/images/pdftoolkit-logo.svg|g' {} \;

echo "✅ 已更新LOGO引用"

echo "完成！请手动检查以下文件："
echo "- faq.html"
echo "- privacy.html"  
echo "- terms.html"
echo "- src/pages/*.html"

