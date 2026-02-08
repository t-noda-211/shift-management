import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

const IMPORT_DEPENDENCY_ERROR_MESSAGE = '依存関係によりインポートできません。'

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
  // ------------------------------------------------------------
  // 全体的なインポート設定
  // ------------------------------------------------------------
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
                '**/aggregates/shiftSchedule/standardShiftAssignment',
                '**/aggregates/shiftSchedule/standardShiftAssignment.*',
                '**/aggregates/shiftSchedule/customShiftAssignment',
                '**/aggregates/shiftSchedule/customShiftAssignment.*',
                '**/aggregates/shiftSchedule/timeOffAssignment',
                '**/aggregates/shiftSchedule/timeOffAssignment.*',
                '**/aggregates/shiftSchedule/shiftNotice',
                '**/aggregates/shiftSchedule/shiftNotice.*',
                '**/aggregates/shiftSchedule/shiftScheduleHistory*',
                './employee',
                './shiftType',
                './shiftSchedule',
                './standardShiftAssignment',
                './customShiftAssignment',
                './timeOffAssignment',
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
  },
  // ------------------------------------------------------------
  // 集約の設定
  // ------------------------------------------------------------
  // employee
  {
    files: ['src/domain/aggregates/employee/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '**/aggregates/shiftType',
                '**/aggregates/shiftType/**',
                '**/aggregates/shiftSchedule',
                '**/aggregates/shiftSchedule/**',
                '../shiftType',
                '../shiftType/**',
                '../shiftSchedule',
                '../shiftSchedule/**',
              ],
              message: IMPORT_DEPENDENCY_ERROR_MESSAGE,
            },
          ],
        },
      ],
    },
  },
  // shiftType
  {
    files: ['src/domain/aggregates/shiftType/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '**/aggregates/employee',
                '**/aggregates/employee/**',
                '**/aggregates/shiftSchedule',
                '**/aggregates/shiftSchedule/**',
                '../employee',
                '../employee/**',
                '../shiftSchedule',
                '../shiftSchedule/**',
              ],
              message: IMPORT_DEPENDENCY_ERROR_MESSAGE,
            },
          ],
        },
      ],
    },
  },
  // shiftSchedule
  {
    files: ['src/domain/aggregates/shiftSchedule/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '**/aggregates/employee',
                '**/aggregates/employee/**',
                '**/aggregates/shiftType',
                '**/aggregates/shiftType/**',
                '../employee',
                '../employee/**',
                '../shiftType',
                '../shiftType/**',
              ],
              message: IMPORT_DEPENDENCY_ERROR_MESSAGE,
            },
          ],
        },
      ],
    },
  },
  // shiftAssignment
  {
    files: [
      'src/domain/aggregates/shiftSchedule/standardShiftAssignment.ts',
      'src/domain/aggregates/shiftSchedule/customShiftAssignment.ts',
      'src/domain/aggregates/shiftSchedule/timeOffAssignment.ts',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '**/aggregates/employee',
                '**/aggregates/employee/**',
                '**/aggregates/shiftType',
                '**/aggregates/shiftType/**',
                '**/aggregates/shiftSchedule/shiftSchedule',
                '**/aggregates/shiftSchedule/shiftSchedule.*',
                '**/aggregates/shiftSchedule/shiftNotice',
                '**/aggregates/shiftSchedule/shiftNotice.*',
                '../employee',
                '../employee/**',
                '../shiftType',
                '../shiftType/**',
                './shiftSchedule',
                './shiftSchedule.*',
                './shiftNotice',
                './shiftNotice.*',
              ],
              message: IMPORT_DEPENDENCY_ERROR_MESSAGE,
            },
          ],
        },
      ],
    },
  },
  // shiftNotice
  {
    files: ['src/domain/aggregates/shiftSchedule/shiftNotice.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '**/aggregates/employee',
                '**/aggregates/employee/**',
                '**/aggregates/shiftType',
                '**/aggregates/shiftType/**',
                '**/aggregates/shiftSchedule/shiftSchedule',
                '**/aggregates/shiftSchedule/shiftSchedule.*',
                '**/aggregates/shiftSchedule/standardShiftAssignment',
                '**/aggregates/shiftSchedule/standardShiftAssignment.*',
                '**/aggregates/shiftSchedule/customShiftAssignment',
                '**/aggregates/shiftSchedule/customShiftAssignment.*',
                '**/aggregates/shiftSchedule/timeOffAssignment',
                '**/aggregates/shiftSchedule/timeOffAssignment.*',
                '../shiftType',
                '../shiftType/**',
                '../shiftSchedule',
                '../shiftSchedule/**',
                './standardShiftAssignment',
                './customShiftAssignment',
                './timeOffAssignment',
              ],
              message: IMPORT_DEPENDENCY_ERROR_MESSAGE,
            },
          ],
        },
      ],
    },
  },

  // ------------------------------------------------------------
  // 値オブジェクトの設定
  // ------------------------------------------------------------
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
  }
)
