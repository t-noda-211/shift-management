import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      globals: {
        // Node.js のグローバル
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'writable',
      },
    },
  },
  // 値オブジェクトの設定
  {
    files: ['src/domain/valueObjects/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '**/aggregates',
                '**/aggregates/**',
                '../aggregates',
                '../aggregates/**',
                '../../aggregates',
                '../../aggregates/**',
              ],
              message: '値オブジェクトから集約をインポートすることはできません',
            },
          ],
        },
      ],
    },
  },
  // index.ts からのインポートのみ許可、直接インポート禁止
  {
    files: ['src/**/*.ts'],
    ignores: [
      '**/aggregates/*/index.ts',
      '**/valueObjects/index.ts',
      '**/valueObjects/*.ts',
      '**/valueObjects/*.test.ts',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '**/aggregates/employee/employee',
                '**/aggregates/employee/employee.*',
                '**/aggregates/shiftType/shiftType',
                '**/aggregates/shiftType/shiftType.*',
                '**/aggregates/shiftSchedule/shiftSchedule',
                '**/aggregates/shiftSchedule/shiftSchedule.*',
                '**/aggregates/shiftSchedule/shiftAssignment',
                '**/aggregates/shiftSchedule/shiftAssignment.*',
                '**/aggregates/shiftSchedule/shiftNotice',
                '**/aggregates/shiftSchedule/shiftNotice.*',
                '**/aggregates/shiftSchedule/shiftScheduleHistory*',
                './employee',
                './shiftType',
                './shiftSchedule',
                '../employee/employee',
                '../shiftType/shiftType',
                '../shiftSchedule/shiftSchedule',
              ],
              message: '集約は index からインポートしてください',
            },
            {
              group: [
                '**/valueObjects/employee*',
                '**/valueObjects/shift*',
                '**/valueObjects/timeOff*',
                '**/valueObjects/valueObject',
                '**/valueObjects/valueObject.*',
                '**/valueObjects/valueObjectError',
                '**/valueObjects/valueObjectError.*',
                '**/valueObjects/workSummary',
                '**/valueObjects/workSummary.*',
                './employeeFullName',
                './employeeId',
                './employeeType',
                './shiftAssignmentDate',
                './shiftAssignmentId',
                './shiftNoticeContent',
                './shiftNoticeId',
                './shiftNoticeTitle',
                './shiftScheduleId',
                './shiftScheduleMonth',
                './shiftScheduleYear',
                './shiftTypeId',
                './shiftTypeName',
                './shiftTypeTime',
                './timeOffType',
                './valueObject',
                './valueObjectError',
                './workSummary',
              ],
              message: '値オブジェクトは index からインポートしてください',
            },
          ],
        },
      ],
    },
  }
)
