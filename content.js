// 将之前的 TravelGuidePlugin 类代码移到这里
class TravelGuidePlugin {
    constructor() {
        this.cities = new Set(['北京', '上海', '广州', '深圳', '成都', '杭州']); 
        this.guideCache = new Map();
        this.activeGuideList = null;
        this.debounceTimer = null;
        this.initializePlugin();
    }

    initializePlugin() {
        document.addEventListener('mouseup', this.debounce(this.handleTextSelection.bind(this), 300));
        document.addEventListener('input', this.debounce(this.handleInput.bind(this), 300));
        document.addEventListener('click', this.handleOutsideClick.bind(this));
    }

    debounce(func, wait) {
        return (...args) => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => func.apply(this, args), wait);
        };
    }

    handleOutsideClick(event) {
        if (this.activeGuideList && 
            !event.target.closest('.city-icon') && 
            !event.target.closest('.travel-guides')) {
            this.activeGuideList.remove();
            this.activeGuideList = null;
        }
    }

    handleTextSelection(event) {
        const selectedText = window.getSelection().toString().trim();
        if (this.cities.has(selectedText)) {
            this.removeExistingIcons();
            this.showCityIcon(selectedText, event);
        }
    }

    handleInput(event) {
        const inputText = event.target.value;
        this.removeExistingIcons();
        for (const city of this.cities) {
            if (inputText.includes(city)) {
                this.showCityIcon(city, event);
                break;
            }
        }
    }

    removeExistingIcons() {
        document.querySelectorAll('.city-icon').forEach(icon => icon.remove());
    }

    showCityIcon(cityName, event) {
        const icon = document.createElement('div');
        icon.className = 'city-icon';
        icon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="#4CAF50" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <div class="tooltip">查看${cityName}旅游攻略</div>
            <div class="loading-indicator" style="display: none;">加载中...</div>
        `;
        
        const rect = event.target.getBoundingClientRect();
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;
        
        icon.style.position = 'absolute';
        icon.style.left = `${event.pageX + 10}px`;
        icon.style.top = `${event.pageY + 10}px`;

        this.adjustIconPosition(icon);

        icon.addEventListener('click', async (e) => {
            e.stopPropagation();
            const loadingIndicator = icon.querySelector('.loading-indicator');
            loadingIndicator.style.display = 'block';
            
            try {
                await this.showTravelGuides(cityName);
            } catch (error) {
                this.showError('获取攻略信息失败，请稍后重试');
            } finally {
                loadingIndicator.style.display = 'none';
            }
        });
        
        document.body.appendChild(icon);
    }

    // ... (其余方法保持不变)
}

// 初始化插件
new TravelGuidePlugin(); 