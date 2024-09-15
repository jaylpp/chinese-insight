let floatingButton;
let sidebar;

function createFloatingButton() {
  const button = document.createElement('button');
  button.textContent = '汉语新解';
  button.id = 'hanyu-xingjie-button';
  button.style.cssText = `
    position: absolute;
    z-index: 2147483647;
    padding: 5px 10px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    pointer-events: auto;
    visibility: hidden;
  `;
  document.body.appendChild(button);
  return button;
}

function createSidebar() {
  const sidebar = document.createElement('div');
  sidebar.style.cssText = `
    position: fixed;
    top: 0;
    right: -400px;
    width: 400px;
    height: 100vh;
    background-color: #f8f8f8;
    box-shadow: -2px 0 5px rgba(0,0,0,0.3);
    transition: right 0.3s;
    z-index: 2147483647;
    padding: 20px;
    box-sizing: border-box;
    overflow-y: auto;
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
  `;

  // 添加标题和按钮容器
  const headerContainer = document.createElement('div');
  headerContainer.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
  `;

  const tabName = document.createElement('h2');
  tabName.textContent = '汉语新解';
  tabName.style.cssText = `
    margin: 0;
    color: #333;
    font-size: 24px;
  `;

  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = `
    display: flex;
    gap: 10px;
  `;

  // 添加配置图标
  const configIcon = document.createElement('span');
  configIcon.textContent = '⚙️';
  configIcon.style.cssText = `
    font-size: 24px;
    cursor: pointer;
  `;
  configIcon.title = '打开配置页面';
  configIcon.addEventListener('click', openConfigPage);

  // 添加关闭按钮
  const closeButton = document.createElement('span');
  closeButton.textContent = '×';
  closeButton.style.cssText = `
    font-size: 24px;
    cursor: pointer;
    color: #333;
  `;
  closeButton.title = '关闭侧边栏';
  closeButton.addEventListener('click', closeSidebar);

  buttonContainer.appendChild(configIcon);
  buttonContainer.appendChild(closeButton);

  headerContainer.appendChild(tabName);
  headerContainer.appendChild(buttonContainer);

  const selectedWord = document.createElement('h3');
  selectedWord.id = 'selected-word';
  selectedWord.style.cssText = `
    margin: 2px 0 20px 0;
    color: #666;
    font-size: 18px;
    text-align: center;
    font-weight: normal;
  `;

  // 添加图片展示区域
  const imageContainer = document.createElement('div');
  imageContainer.id = 'image-container';
  imageContainer.style.cssText = `
    width: 100%;
    height: 100%;
    min-height: 500px;
    background-color: #fff;
    margin: 10px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  `;

  // 添加下载按钮
  const downloadButton = document.createElement('button');
  downloadButton.textContent = '下载图片';
  downloadButton.style.cssText = `
    display: block;
    margin: 13px auto;
    padding: 10px 20px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
  `;
  downloadButton.addEventListener('mouseover', () => {
    downloadButton.style.backgroundColor = '#2980b9';
  });
  downloadButton.addEventListener('mouseout', () => {
    downloadButton.style.backgroundColor = '#3498db';
  });
  downloadButton.addEventListener('click', downloadImage);

  sidebar.appendChild(headerContainer);
  sidebar.appendChild(selectedWord);
  sidebar.appendChild(imageContainer);
  sidebar.appendChild(downloadButton);
  document.body.appendChild(sidebar);
  return sidebar;
}

// 添加新的函数来调用 API 并处理流式响应
async function fetchExplanation(text) {
  const imageContainer = document.getElementById('image-container');
  // 大于 10 个字符报错
  if (text.length > 10) {
    imageContainer.innerHTML = '<p>不建议文本长度超过10哦～</p>';
    return;
  }
  
  imageContainer.innerHTML = '<p>正在分析，请稍候...</p>';

  // 获取 options.html 中的配置项
  chrome.storage.sync.get(['apiKey', 'model'], function(items) {
    const apiKey = items.apiKey; // 默认 API Key
    const model = items.model || 'glm-4-flash'; // 默认模型

    // 使用获取到的配置项
    fetchExplanationWithConfig(imageContainer, text, apiKey, model);
  });
}

  // 新的函数，使用配置项调用 API
async function fetchExplanationWithConfig(imageContainer, text, apiKey, model) {
  try {
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey
      },
      body: JSON.stringify({
        "model": model,
        "stream": true,
        "messages": [
          {
            "role": "user",
            "content": "### 色：\n你是新汉语老师，你年轻,批判现实,思考深刻,语言风趣。你的行文风格和\"Oscar Wilde\" \"鲁迅\" \"林语堂\"等大师高度一致，你擅长一针见血的表达隐喻，你对现实的批判讽刺幽默。\n\n## 基本信息\n- 作者：云中江树，李继刚\n- 重写：熊猫 Jay\n- 版本：v0.3\n- 模型：阿里通义\n\n## 输出结果的字段解释\n1. interpretation : 将汉语词汇进行全新角度的解释，你会用一个特殊视角来解释一个词汇：\n用一句话表达你的词汇解释，抓住用户输入词汇的本质，使用辛辣的讽刺、一针见血的指出本质，使用包含隐喻的金句。\n例如：\"委婉\"： \"刺向他人时, 决定在剑刃上撒上止痛药。\" 注意输出结果使用类似现代诗排版的HTML的<p>标签，换行使用<br>\n2. word: 词汇原文\n3. spell: 词汇原文的拼音\n4. english:词汇原文的英文翻译\n5. japanese:词汇原文的日文翻译\n6. summary:词汇原文的精简，一定不能超过 2 个字\n\n## 输出格式\n{\n\t\"interpretation\":\"xxxx\",\n\t\"word\":\"xxxx\",\n\t\"spell\":\"xxxx\",\n\t\"english\":\"xxxx\",\n\t\"japanese\":\"xxxxx\"\n,\n\t\"summary\":\"xxxxx\"\n}\n\n## 任务：\n分析词汇```" + text +"```，根据<输出结果的字段解释>中每个属性的定义来输出对应的类型，并按照<输出格式>输出 JSON 格式，注意只输出 JSON，不输出任何其他内容。"
          }
        ],
        "type": "retrieval"
      })
    });

    console.log("API 响应状态:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API 错误:', errorData);
      imageContainer.innerHTML = `<p>API 请求失败: ${errorData.error.message || '未知错误'}</p>`;
      return;
    }

    const reader = response.body.getReader();
    let result = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const decodedValue = new TextDecoder().decode(value);
      const lines = decodedValue.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          if (line.includes('[DONE]')) {
            break;
          }
          try {
            const jsonData = JSON.parse(line.substring(6));
            if (jsonData.choices && jsonData.choices[0] && jsonData.choices[0].delta) {
              if (jsonData.choices[0].delta.content) {
                result += jsonData.choices[0].delta.content;
              }
              if (jsonData.choices[0].finish_reason === 'stop') {
                break;
              }
            }
          } catch (error) {
            console.error('解析JSON时出错:', error);
          }
        }
      }
    }

    imageContainer.innerHTML = '<p>正在为您生成图片...</p>';

    const html = await fetchTemplate(result);

    console.log("html:", html);

    // 创建一个临时的 div 元素来渲染 HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    // 尝试从 style 标签中提取背景颜色
    let divBackgroundColor = '#F7F7E7'; // 默认背景颜色
    const styleTag = tempDiv.querySelector('style');
    if (styleTag) {
        const styleContent = styleTag.textContent;
        const match = styleContent.match(/--background-color:\s*(#[A-Fa-f0-9]{6}|#[A-Fa-f0-9]{3})/);
        if (match) {
            divBackgroundColor = match[1];
        }
    }

    tempDiv.style.cssText = `
        position: absolute;
        left: -9999px;
        top: -9999px;
        width: 450px;
        height: 800px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: ${divBackgroundColor};
    `;
    
    console.log("divBackgroundColor:", divBackgroundColor);

    document.body.appendChild(tempDiv);

    // 使用 html2canvas 将 HTML 转换为图片
    html2canvas(tempDiv, {
      width: 450,
      height: 800,
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null
    }).then(canvas => {
      // 将 canvas 转换为图片 URL
      const imgUrl = canvas.toDataURL('image/png');
      
      // 创建 img 元素并设置其 src
      const img = document.createElement('img');
      img.src = imgUrl;
      img.style.maxWidth = '100%';
      img.style.maxHeight = '150%';
      img.style.objectFit = 'contain';
      img.style.borderRadius = '8px';

      // 创建一个包装 div 来居中图片
      const wrapper = document.createElement('div');
      wrapper.style.cssText = `
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #ffffff;
      `;
      wrapper.appendChild(img);

      // 清空 imageContainer 并添加包装 div
      imageContainer.innerHTML = '';
      imageContainer.style.display = 'flex';
      imageContainer.style.justifyContent = 'center';
      imageContainer.style.alignItems = 'center';
      imageContainer.appendChild(wrapper);

    }).catch(error => {
      console.error('Error generating image:', error);
      imageContainer.innerHTML = '<p>生成图片时出错，请重试。</p>';
    }).finally(() => {
        // 清理临时 div
        document.body.removeChild(tempDiv);
    });

  } catch (error) {
    console.error('Error fetching explanation:', error);
    imageContainer.innerHTML = '<p>获取卡片出错，请检查网络连接或配置 API Key</p>';
  }
}

let templates;

// 新增函数：加载模板
function loadTemplates() {
  return fetch(chrome.runtime.getURL('template.json'))
    .then(response => response.json())
    .catch(error => {
      console.error('加载模板文件时出错:', error);
      return {}; // 返回空对象作为默认值
    });
}

async function fetchTemplate(result) {
  if (!templates) {
    templates = await loadTemplates();
  }

  // 生成一个随机数，从 1-10 中选择
  //const randomNumber = Math.floor(Math.random() * 10) + 1;

  let randomNumber = Math.floor(Math.random() * 10) + 1;
  // 获取随机模板
  const template = templates[randomNumber];

  // 当result中存在{ 和 }时，则去掉{前面的内容，并去掉}后面的内容，防止解析 JSON 出错
  if (result.includes('{') && result.includes('}')) {
    result = result.substring(result.indexOf('{'), result.lastIndexOf('}') + 1);
  }

  // 解析 API 返回的 JSON 结果
  let data;
  try {
    data = JSON.parse(result);
  } catch (error) {
    console.error('无法解析 JSON 结果:', error);
  }

  // 特殊处理 interpretation，先判断是否存在 <br>，不存在,则在每个逗号、句号、问号、顿号后增加<br>
  let interpretation = data.interpretation;
  if (!interpretation.includes('<br>')) {
    interpretation = interpretation.replace(/([，。！？、])/g, '$1<br>');
  }

  // 使用模板生成 HTML
  const html = template
    .replace(/{{word}}/g, data.word)
    .replace('{{spell}}', data.spell)
    .replace('{{english}}', data.english)
    .replace('{{japanese}}', data.japanese)
    .replace('{{interpretation}}', interpretation)
    .replace('{{summary}}', data.summary);

  return html;
}

// 修改 loadImage 函数
function loadImage(text) {
  fetchExplanation(text);
}

// 修改 downloadImage 函数
function downloadImage() {
  const imageContainer = document.getElementById('image-container');
  const img = imageContainer.querySelector('img');
  if (img) {
    const link = document.createElement('a');
    link.href = img.src;
    link.download = '汉语新解图片.png';
    link.click();
  } else {
    alert('没有可下载的图片');
  }
}

// 添加打开配置页面的函数
function openConfigPage() {
    chrome.runtime.sendMessage({ action: "openOptionsPage" });
}

function openSidebar(selectedText) {
  sidebar.style.right = '0';
  const selectedWord = document.getElementById('selected-word');
  selectedWord.textContent = `"${selectedText}"`;
  loadImage(selectedText);
}

// 关闭侧边栏
function closeSidebar() {
  sidebar.style.right = '-400px';  // 匹配新的宽度
}

// 点击侧边栏外部关闭侧边栏
document.addEventListener('click', (e) => {
  if (!sidebar.contains(e.target) && e.target !== floatingButton) {
    closeSidebar();
  }
});

function initializeExtension() {
  // 预加载字体
  const fontLink = document.createElement('link');
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC&display=swap';
  fontLink.rel = 'stylesheet';
  document.head.appendChild(fontLink);

  floatingButton = createFloatingButton();
  sidebar = createSidebar();

  // 点击悬浮按钮打开侧边栏
  floatingButton.addEventListener('click', () => {
    const selectedText = window.getSelection().toString().trim();
    openSidebar(selectedText);
    floatingButton.style.visibility = 'hidden';
  });

  // 监听选中文本事件，但排除侧边栏内的选择
  document.addEventListener('mouseup', (e) => {
    if (!sidebar.contains(e.target)) {
      handleTextSelection(e);
    }
  });

  console.log('浮动按钮已创建:', floatingButton);
  console.log('浮动按钮样式:', floatingButton.style.cssText);
}

function updateButtonPosition(x, y) {
  floatingButton.style.left = `${x}px`;
  floatingButton.style.top = `${y + 20}px`; // 稍微向下移动一点
  floatingButton.style.visibility = 'visible';
}

function handleTextSelection(e) {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText && !sidebar.contains(e.target)) {
    updateButtonPosition(e.pageX, e.pageY);
    console.log('显示悬浮按钮', e.pageX, e.pageY, floatingButton.style.visibility);
  } else {
    floatingButton.style.visibility = 'hidden';
    console.log('隐藏悬浮按钮');
  }
}

// 立即初始化扩展
initializeExtension();

// 在 DOMContentLoaded 事件触发时新初始化扩展
document.addEventListener('DOMContentLoaded', initializeExtension);
