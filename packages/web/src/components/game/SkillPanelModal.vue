<script setup lang="ts">
import { computed } from "vue";
import BaseModal from "@/components/common/BaseModal.vue";
import { usePlayerStore } from "@/stores/player.store";
import { SKILL_DESCRIPTIONS } from "@shared/constants/game.enum";
import {
  getSkillMaxLevel,
  getSkillUpgradeExperience,
} from "@shared/utils/calculator";

defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const playerStore = usePlayerStore();

const skillDetails = computed(() => {
  return playerStore.skills.map((skill) => {
    const maxLevel = getSkillMaxLevel(skill.id);
    const upgradeExp = getSkillUpgradeExperience(skill);
    const expPercent =
      skill.maxExperience > 0
        ? Math.min(100, (skill.experience / skill.maxExperience) * 100)
        : 100;
    const isMaxLevel = skill.level >= maxLevel;

    return {
      ...skill,
      description: SKILL_DESCRIPTIONS[skill.id],
      maxLevel,
      upgradeExp,
      expPercent,
      isMaxLevel,
      progress: (skill.level / maxLevel) * 100,
    };
  });
});

const totalSkillLevels = computed(() =>
  playerStore.skills.reduce((sum, s) => sum + s.level, 0),
);

function getSkillColor(id: string): string {
  switch (id) {
    case "programming":
      return "#4fc3f7";
    case "operation":
      return "#ff9800";
    case "social":
      return "#e91e63";
    default:
      return "#4fc3f7";
  }
}
</script>

<template>
  <BaseModal :show="show" title="技能面板" @close="emit('close')">
    <div class="skill-panel">
      <div class="skill-overview">
        <div class="overview-label">技能总等级</div>
        <div class="overview-value">{{ totalSkillLevels }}</div>
        <div class="overview-desc">技能等级影响事件选择和工作效率</div>
      </div>

      <div class="skill-list">
        <div v-for="skill in skillDetails" :key="skill.id" class="skill-card">
          <div class="skill-header">
            <div class="skill-title">
              <span
                class="skill-name"
                :style="{ color: getSkillColor(skill.id) }"
              >
                {{ skill.name }}
              </span>
              <span class="skill-level">
                Lv.{{ skill.level
                }}<span v-if="skill.isMaxLevel" class="max-badge">MAX</span>
              </span>
            </div>
            <div class="skill-progress-bar">
              <div
                class="skill-progress-fill"
                :style="{
                  width: `${skill.progress}%`,
                  background: getSkillColor(skill.id),
                }"
              ></div>
            </div>
          </div>

          <p class="skill-description">{{ skill.description }}</p>

          <div v-if="!skill.isMaxLevel" class="skill-exp">
            <div class="exp-label">经验值</div>
            <div class="exp-bar-container">
              <div class="exp-bar">
                <div
                  class="exp-fill"
                  :style="{
                    width: `${skill.expPercent}%`,
                    background: getSkillColor(skill.id),
                  }"
                ></div>
              </div>
              <span class="exp-text"
                >{{ skill.experience }} / {{ skill.maxExperience }}</span
              >
            </div>
            <div class="upgrade-hint">
              下一级还需 {{ skill.maxExperience - skill.experience }} 经验
            </div>
          </div>
          <div v-else class="max-level-hint">🎉 技能已满级！</div>
        </div>
      </div>

      <div class="skill-tips">
        <h4>💡 技能说明</h4>
        <ul>
          <li>
            <strong style="color: #4fc3f7">编程入门</strong> -
            影响程序员路线面试通过率，解锁技术类事件
          </li>
          <li>
            <strong style="color: #ff9800">运营基础</strong> -
            影响运营/产品路线面试，解锁推广类事件
          </li>
          <li>
            <strong style="color: #e91e63">社交能力</strong> -
            影响人脉拓展、偶遇事件触发概率
          </li>
          <li>精力、心情、健康状态越好，技能学习效率越高</li>
        </ul>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.skill-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.skill-overview {
  text-align: center;
  padding: 16px;
  background: rgba(79, 195, 247, 0.1);
  border-radius: 12px;
}

.overview-label {
  font-size: 14px;
  color: #888;
  margin-bottom: 8px;
}

.overview-value {
  font-size: 36px;
  font-weight: bold;
  color: #4fc3f7;
}

.overview-desc {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
}

.skill-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skill-card {
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.skill-header {
  margin-bottom: 12px;
}

.skill-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.skill-name {
  font-size: 16px;
  font-weight: bold;
}

.skill-level {
  font-size: 14px;
  color: #fff;
  font-weight: bold;
}

.max-badge {
  display: inline-block;
  margin-left: 6px;
  padding: 2px 6px;
  background: linear-gradient(135deg, #ffc107, #ff9800);
  color: #000;
  font-size: 10px;
  border-radius: 4px;
}

.skill-progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.skill-progress-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.skill-description {
  font-size: 13px;
  color: #888;
  margin: 0 0 12px;
  line-height: 1.5;
}

.skill-exp {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.exp-label {
  font-size: 12px;
  color: #666;
}

.exp-bar-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.exp-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.exp-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.exp-text {
  font-size: 12px;
  color: #aaa;
  min-width: 80px;
  text-align: right;
}

.upgrade-hint {
  font-size: 11px;
  color: #666;
}

.max-level-hint {
  text-align: center;
  padding: 8px;
  background: rgba(255, 193, 7, 0.1);
  border-radius: 4px;
  color: #ffc107;
  font-size: 13px;
}

.skill-tips {
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.skill-tips h4 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #aaa;
}

.skill-tips ul {
  margin: 0;
  padding-left: 20px;
  font-size: 12px;
  color: #888;
  line-height: 1.8;
}

@media (max-width: 480px) {
  .skill-panel {
    gap: 16px;
  }

  .skill-overview {
    padding: 12px;
  }

  .overview-value {
    font-size: 28px;
  }

  .skill-card {
    padding: 12px;
  }

  .skill-name {
    font-size: 15px;
  }

  .exp-text {
    min-width: 70px;
    font-size: 11px;
  }

  .skill-tips ul {
    font-size: 11px;
    line-height: 1.7;
  }
}
</style>
