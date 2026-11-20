**AR:** اختبر البيانات ذات الصلة ضمن إجراء «إعداد البريد الإلكتروني SMTP واختباره وتعطيله بأمان»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Disable or escalate failures with preserved queue evidence. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** صعّد البيانات ذات الصلة ضمن إجراء «إعداد البريد الإلكتروني SMTP واختباره وتعطيله بأمان»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant Communications workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: Queue/send attempt does not prove inbox delivery; protect SMTP secrets and avoid promised push/SMS. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified communications record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.

**AR:** المخرجات والتسليم: تحقق من حالة السجل والوقت والمنفذ والمعرفات والأرصدة أو المخزون أو السعة المرتبطة. عين مسؤول متابعة واضحاً لأي استثناء وأكمل التسليم المادي أو المالي بشكل منفصل عند الحاجة.


#### 12. Records, privacy and retention / السجلات والخصوصية والاحتفاظ

**EN:** [Verify source]

**AR:** السجلات والخصوصية والاحتفاظ: احتفظ بالمراجع والأدلة في الموقع المعتمد، وحدد صلاحية الاطلاع حسب العضو والأكاديمية. مدد الحفظ والإتلاف وموقع الأرشيف تحتاج موافقة الإدارة.


#### 13. Monitoring and sign-off / المتابعة والتوقيع

**EN:** Proposed verifier checks identity/academy, source evidence, server result, linked balance/stock/capacity effects, exception closure and communication. Track unresolved cases and duplicates; metric denominator, frequency, target and reviewer: TBC.

**AR:** المتابعة والتوقيع: يراجع المخول الهوية والأدلة والنتيجة والتأثيرات المرتبطة وسلامة التصحيح وتسوية الاستثناءات. المؤشرات والأهداف ودورية المتابعة تحتاج إلى موافقة الإدارة.


#### 14. Safety, legal and professional boundaries / حدود السلامة والقانون والمهنة

**EN:** Queue/send attempt does not prove inbox delivery; protect SMTP secrets and avoid promised push/SMS. Application permission is not clinical, safety, financial or legal authority. Any operational policy not evidenced in the KB requires human approval; do not infer thresholds, tax compliance, prescriptions, tariffs, contractual rights or physical readiness.

**AR:** حدود السلامة والقانون والمهنة: صلاحية استخدام النظام ليست اعتماداً طبياً أو بيطرياً أو مالياً أو قانونياً. لا تُستنتج حدود السلامة أو الجرعات أو الأسعار أو المتطلبات التنظيمية من بيانات تجريبية أو من واجهات النظام.


#### 15. Training and competence / التدريب والكفاءة

**EN:** Authorised operator must demonstrate correct academy and record selection, appropriate screen/action permission, execution of the four steps, stop conditions, evidence capture and escalation. Trainer, assessment, refresher schedule and sign-off: TBC.

**AR:** التدريب والكفاءة: يجب أن يثبت المنفذ قدرته على التحقق من السجل والصلاحيات واتباع خطوات الإجراء واكتشاف حالات التوقف وتوثيق الاستثناءات والتسليم. معايير التقييم واعتماد الكفاءة غير محددة.


#### 16. Source trace and change log / المصادر وسجل التغيير

**EN:** RPH-CMS-KB-001 rev 1.0 §§7, 19, 21, 25, 26; catalogue §25; decision register §26; evidence §28; SOP template §29. Linked decisions: DEC-18, DEC-19, DEC-20, DEC-26 (applicability and policy values to be confirmed). Revision 0.1 dated 20 Nov 2026, AI-assisted initial draft, no human approval.

**AR:** المصدر والإصدار: راجع الأقسام المشار إليها في قاعدة المعرفة RPH-CMS-KB-001 وسجل القرارات غير المحسومة وسجل التعديلات. لا يصبح الإجراء نافذاً قبل استكمال مراجعة أصحاب الصلاحية واعتماده.

**Revision:** 1.0.2 — Arabic language and bilingual layout improvements; human approval pending.


### COM-003 — Investigate queued/failed/duplicate email and recovery failures

**العنوان العربي:** التحقيق في الرسائل المعلقة أو الفاشلة أو المكررة ومشكلات الاسترداد

**v1.0.2 | DRAFT — NOT APPROVED FOR OPERATIONAL USE**


#### 1. Control header / بيانات ضبط الإجراء

**EN:** ID: COM-003 | Version: 1.0.2 | Status: DRAFT — NOT APPROVED FOR OPERATIONAL USE | Priority: P1 | Proposed owner: IT/support | Proposed approver: designated accountable manager/specialist (TBC) | Effective/review dates: TBC | Related SOPs: COM-001, COM-002, COM-004.

**AR:** البيانات الأساسية: رقم الإجراء وإصداره وحالته ومسؤوليته وأولوية تنفيذه والموافقات المطلوبة وتاريخ النفاذ والمراجعة. جميع المسؤوليات المقترحة تحتاج اعتماد الإدارة، ولا يوجد اعتماد تشغيلي لهذه النسخة.


#### 2. Purpose / الغرض

**EN:** Ensure controlled, traceable execution of: investigate queued/failed/duplicate email and recovery failures, with correct academy/customer/horse references, documented exceptions and authorised follow-up.

**AR:** الغرض من هذا الإجراء هو «التحقيق في الرسائل المعلقة أو الفاشلة أو المكررة ومشكلات الاسترداد» على نحوٍ موثق وقابل للمراجعة، مع التصعيد عند وجود استثناء.


#### 3. Scope and exclusions / النطاق والاستثناءات

**EN:** Communications workflow in the authenticated management web portal and, only where implemented, member web/native iOS. Authoring and privileged configuration are web/restricted-operator tasks unless explicitly supported in the app. No public marketing website, unapproved physical service, clinical prescription, legal decision, bank transaction or software change is authorised by this draft.

**AR:** ينطبق على العملية «التحقيق في الرسائل المعلقة أو الفاشلة أو المكررة ومشكلات الاسترداد» ضمن صلاحيات النظام المعتمدة، ولا يشمل تنفيذ أعمال خارج نطاق التفويض.


#### 4. Trigger and frequency / متى يبدأ وتكراره

**EN:** Start when the described operation is requested, a relevant record changes or an exception is discovered. Routine review frequency and response targets: TBC — MANAGEMENT APPROVAL REQUIRED.

**AR:** يُنفذ عند الحاجة إلى «التحقيق في الرسائل المعلقة أو الفاشلة أو المكررة ومشكلات الاسترداد»، أما التكرار ومواعيد المتابعة فتحتاج إلى اعتماد إدارة النادي.


#### 5. Responsible roles / الأدوار والمسؤوليات

**EN:** Proposed operator: IT/support; verifier: relevant supervisor or independent reviewer; approver: designated management/finance/veterinary/technical authority as applicable; escalation deputy: TBC. These are proposed functions, not confirmed appointments. Separate business approval from software grants.

**AR:** الأدوار: المنفذ هو المسؤول المقترح في فهرس الإجراءات؛ ويقوم المشرف أو المراجع المستقل بالتحقق، وتعتمد الجهة المختصة القرار عند الحاجة. يُفصل بين صلاحية النظام والموافقة الإدارية أو المهنية.


#### 6. Prerequisites / المتطلبات المسبقة

**EN:** Verify personal sign-in, selected academy, correct source record and ID, permitted action, up-to-date application state, and any approved policy, evidence, physical resource or external receipt required. Applicable access: Email Settings Edit on web; personal notification read access.

**AR:** المتطلبات المسبقة: تحقق من الحساب الشخصي والأكاديمية المختارة ومعرف السجل والصلاحية وصحة البيانات الحالية. لا تُنفذ العملية دون مستند أو موافقة أو مورد أو إثبات مالي خارجي عندما يكون مطلوباً.


#### 7. Inputs and evidence / المدخلات والأدلة

**EN:** Retain relevant user/horse/class/booking/plan/inventory/stay IDs, Riyadh-local date and original timestamp, source approval, supporting documents, before/after values and reference numbers. Do not record passwords, SMTP secrets or full card data.

**AR:** المدخلات والأدلة: سجل المعرفات المرجعية والتاريخ والتوقيت المحلي للرياض والمرجع الأصلي والموافقة والمرفقات والقيم قبل التعديل وبعده. لا تُدوّن كلمات المرور أو مفاتيح الخدمات أو بيانات البطاقات الحساسة.


#### 8. Procedure / خطوات التنفيذ

**EN:** Numbered operational steps; use exact currently deployed screen labels where they differ from the working terms below.

**AR:** خطوات التنفيذ: اتبع الخطوات الإنجليزية المرقمة الموازية بالترتيب، وتحقق بعد كل خطوة من النتيجة في السجل الأساسي. إذا لم تتطابق النتيجة، أوقف التكرار غير المدروس وارفع الاستثناء.

**EN:** 8.1. Check SMTP enabled sender recipient and delivery queue/retry state. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع خدمة البريد الإلكتروني ضمن إجراء «التحقيق في الرسائل المعلقة أو الفاشلة أو المكررة ومشكلات الاسترداد»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.2. Identify duplicate message IDs and provider failure evidence. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** تحقق من البيانات ذات الصلة ضمن إجراء «التحقيق في الرسائل المعلقة أو الفاشلة أو المكررة ومشكلات الاسترداد»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تأكد من عدم تكرار القيد أو الحركة. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.3. Escalate recovery issues using verified support without revealing passwords. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** صعّد البيانات ذات الصلة ضمن إجراء «التحقيق في الرسائل المعلقة أو الفاشلة أو المكررة ومشكلات الاسترداد»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Document corrected delivery or unresolved follow-up owner. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** دوّن المستند ضمن إجراء «التحقيق في الرسائل المعلقة أو الفاشلة أو المكررة ومشكلات الاسترداد»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant Communications workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: Mail queue may retry up to five times and can duplicate delivery; delivery is not guaranteed. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified communications record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.

**AR:** المخرجات والتسليم: تحقق من حالة السجل والوقت والمنفذ والمعرفات والأرصدة أو المخزون أو السعة المرتبطة. عين مسؤول متابعة واضحاً لأي استثناء وأكمل التسليم المادي أو المالي بشكل منفصل عند الحاجة.


#### 12. Records, privacy and retention / السجلات والخصوصية والاحتفاظ

**EN:** [Verify source]

**AR:** السجلات والخصوصية والاحتفاظ: احتفظ بالمراجع والأدلة في الموقع المعتمد، وحدد صلاحية الاطلاع حسب العضو والأكاديمية. مدد الحفظ والإتلاف وموقع الأرشيف تحتاج موافقة الإدارة.


#### 13. Monitoring and sign-off / المتابعة والتوقيع

**EN:** Proposed verifier checks identity/academy, source evidence, server result, linked balance/stock/capacity effects, exception closure and communication. Track unresolved cases and duplicates; metric denominator, frequency, target and reviewer: TBC.

**AR:** المتابعة والتوقيع: يراجع المخول الهوية والأدلة والنتيجة والتأثيرات المرتبطة وسلامة التصحيح وتسوية الاستثناءات. المؤشرات والأهداف ودورية المتابعة تحتاج إلى موافقة الإدارة.


#### 14. Safety, legal and professional boundaries / حدود السلامة والقانون والمهنة

**EN:** Queue/send attempt does not prove inbox delivery; protect SMTP secrets and avoid promised push/SMS. Application permission is not clinical, safety, financial or legal authority. Any operational policy not evidenced in the KB requires human approval; do not infer thresholds, tax compliance, prescriptions, tariffs, contractual rights or physical readiness.

**AR:** حدود السلامة والقانون والمهنة: صلاحية استخدام النظام ليست اعتماداً طبياً أو بيطرياً أو مالياً أو قانونياً. لا تُستنتج حدود السلامة أو الجرعات أو الأسعار أو المتطلبات التنظيمية من بيانات تجريبية أو من واجهات النظام.


#### 15. Training and competence / التدريب والكفاءة

**EN:** Authorised operator must demonstrate correct academy and record selection, appropriate screen/action permission, execution of the four steps, stop conditions, evidence capture and escalation. Trainer, assessment, refresher schedule and sign-off: TBC.

**AR:** التدريب والكفاءة: يجب أن يثبت المنفذ قدرته على التحقق من السجل والصلاحيات واتباع خطوات الإجراء واكتشاف حالات التوقف وتوثيق الاستثناءات والتسليم. معايير التقييم واعتماد الكفاءة غير محددة.


#### 16. Source trace and change log / المصادر وسجل التغيير

**EN:** RPH-CMS-KB-001 rev 1.0 §§7, 19, 21, 25, 26; catalogue §25; decision register §26; evidence §28; SOP template §29. Linked decisions: DEC-18, DEC-19, DEC-20, DEC-26 (applicability and policy values to be confirmed). Revision 0.1 dated 20 Nov 2026, AI-assisted initial draft, no human approval.

**AR:** المصدر والإصدار: راجع الأقسام المشار إليها في قاعدة المعرفة RPH-CMS-KB-001 وسجل القرارات غير المحسومة وسجل التعديلات. لا يصبح الإجراء نافذاً قبل استكمال مراجعة أصحاب الصلاحية واعتماده.

**Revision:** 1.0.2 — Arabic language and bilingual layout improvements; human approval pending.


### SYS-001 — Change system defaults/contact details and verify impact

**العنوان العربي:** تغيير إعدادات النظام الافتراضية والتحقق من آثارها

**v1.0.2 | DRAFT — NOT APPROVED FOR OPERATIONAL USE**


#### 1. Control header / بيانات ضبط الإجراء

**EN:** ID: SYS-001 | Version: 1.0.2 | Status: DRAFT — NOT APPROVED FOR OPERATIONAL USE | Priority: P1 | Proposed owner: System admin | Proposed approver: designated accountable manager/specialist (TBC) | Effective/review dates: TBC | Related SOPs: SYS-002, SYS-003, SYS-004, SYS-005, SYS-006.

**AR:** البيانات الأساسية: رقم الإجراء وإصداره وحالته ومسؤوليته وأولوية تنفيذه والموافقات المطلوبة وتاريخ النفاذ والمراجعة. جميع المسؤوليات المقترحة تحتاج اعتماد الإدارة، ولا يوجد اعتماد تشغيلي لهذه النسخة.


#### 2. Purpose / الغرض

**EN:** Ensure controlled, traceable execution of: change system defaults/contact details and verify impact, with correct academy/customer/horse references, documented exceptions and authorised follow-up.

**AR:** الغرض من هذا الإجراء هو «تغيير إعدادات النظام الافتراضية والتحقق من آثارها» على نحوٍ موثق وقابل للمراجعة، مع التصعيد عند وجود استثناء.


#### 3. Scope and exclusions / النطاق والاستثناءات

**EN:** System administration workflow in the authenticated management web portal and, only where implemented, member web/native iOS. Authoring and privileged configuration are web/restricted-operator tasks unless explicitly supported in the app. No public marketing website, unapproved physical service, clinical prescription, legal decision, bank transaction or software change is authorised by this draft.

**AR:** ينطبق على العملية «تغيير إعدادات النظام الافتراضية والتحقق من آثارها» ضمن صلاحيات النظام المعتمدة، ولا يشمل تنفيذ أعمال خارج نطاق التفويض.


#### 4. Trigger and frequency / متى يبدأ وتكراره

**EN:** Start when the described operation is requested, a relevant record changes or an exception is discovered. Routine review frequency and response targets: TBC — MANAGEMENT APPROVAL REQUIRED.

**AR:** يُنفذ عند الحاجة إلى «تغيير إعدادات النظام الافتراضية والتحقق من آثارها»، أما التكرار ومواعيد المتابعة فتحتاج إلى اعتماد إدارة النادي.


#### 5. Responsible roles / الأدوار والمسؤوليات

**EN:** Proposed operator: System admin; verifier: relevant supervisor or independent reviewer; approver: designated management/finance/veterinary/technical authority as applicable; escalation deputy: TBC. These are proposed functions, not confirmed appointments. Separate business approval from software grants.

**AR:** الأدوار: المنفذ هو المسؤول المقترح في فهرس الإجراءات؛ ويقوم المشرف أو المراجع المستقل بالتحقق، وتعتمد الجهة المختصة القرار عند الحاجة. يُفصل بين صلاحية النظام والموافقة الإدارية أو المهنية.


#### 6. Prerequisites / المتطلبات المسبقة

**EN:** Verify personal sign-in, selected academy, correct source record and ID, permitted action, up-to-date application state, and any approved policy, evidence, physical resource or external receipt required. Applicable access: System administrator or restricted technical/deployment operator; separate authorities.

**AR:** المتطلبات المسبقة: تحقق من الحساب الشخصي والأكاديمية المختارة ومعرف السجل والصلاحية وصحة البيانات الحالية. لا تُنفذ العملية دون مستند أو موافقة أو مورد أو إثبات مالي خارجي عندما يكون مطلوباً.


#### 7. Inputs and evidence / المدخلات والأدلة

**EN:** Retain relevant user/horse/class/booking/plan/inventory/stay IDs, Riyadh-local date and original timestamp, source approval, supporting documents, before/after values and reference numbers. Do not record passwords, SMTP secrets or full card data.

**AR:** المدخلات والأدلة: سجل المعرفات المرجعية والتاريخ والتوقيت المحلي للرياض والمرجع الأصلي والموافقة والمرفقات والقيم قبل التعديل وبعده. لا تُدوّن كلمات المرور أو مفاتيح الخدمات أو بيانات البطاقات الحساسة.


#### 8. Procedure / خطوات التنفيذ

**EN:** Numbered operational steps; use exact currently deployed screen labels where they differ from the working terms below.

**AR:** خطوات التنفيذ: اتبع الخطوات الإنجليزية المرقمة الموازية بالترتيب، وتحقق بعد كل خطوة من النتيجة في السجل الأساسي. إذا لم تتطابق النتيجة، أوقف التكرار غير المدروس وارفع الاستثناء.

**EN:** 8.1. Confirm approved settings change and academy scope. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع البيانات ذات الصلة ضمن إجراء «تغيير إعدادات النظام الافتراضية ومراجعة آثارها»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.2. Edit authorised defaults contact names calendar capacity credit cost or hold duration. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** حدّث البيانات ذات الصلة ضمن إجراء «تغيير إعدادات النظام الافتراضية ومراجعة آثارها»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.3. Save and verify new-record behaviour. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع السجل ضمن إجراء «تغيير إعدادات النظام الافتراضية ومراجعة آثارها»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Inspect existing holds and financial snapshots which do not retroactively change. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع البيانات ذات الصلة ضمن إجراء «تغيير إعدادات النظام الافتراضية ومراجعة آثارها»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant System administration workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: Server validation prevails; deployment and backup operations need separate approval; never reset production. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified system administration record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.

**AR:** المخرجات والتسليم: تحقق من حالة السجل والوقت والمنفذ والمعرفات والأرصدة أو المخزون أو السعة المرتبطة. عين مسؤول متابعة واضحاً لأي استثناء وأكمل التسليم المادي أو المالي بشكل منفصل عند الحاجة.


#### 12. Records, privacy and retention / السجلات والخصوصية والاحتفاظ

**EN:** [Verify source]

**AR:** السجلات والخصوصية والاحتفاظ: احتفظ بالمراجع والأدلة في الموقع المعتمد، وحدد صلاحية الاطلاع حسب العضو والأكاديمية. مدد الحفظ والإتلاف وموقع الأرشيف تحتاج موافقة الإدارة.


#### 13. Monitoring and sign-off / المتابعة والتوقيع

**EN:** Proposed verifier checks identity/academy, source evidence, server result, linked balance/stock/capacity effects, exception closure and communication. Track unresolved cases and duplicates; metric denominator, frequency, target and reviewer: TBC.

**AR:** المتابعة والتوقيع: يراجع المخول الهوية والأدلة والنتيجة والتأثيرات المرتبطة وسلامة التصحيح وتسوية الاستثناءات. المؤشرات والأهداف ودورية المتابعة تحتاج إلى موافقة الإدارة.


#### 14. Safety, legal and professional boundaries / حدود السلامة والقانون والمهنة

**EN:** Server validation prevails; deployment and backup operations need separate approval; never reset production. Application permission is not clinical, safety, financial or legal authority. Any operational policy not evidenced in the KB requires human approval; do not infer thresholds, tax compliance, prescriptions, tariffs, contractual rights or physical readiness.

**AR:** حدود السلامة والقانون والمهنة: صلاحية استخدام النظام ليست اعتماداً طبياً أو بيطرياً أو مالياً أو قانونياً. لا تُستنتج حدود السلامة أو الجرعات أو الأسعار أو المتطلبات التنظيمية من بيانات تجريبية أو من واجهات النظام.


#### 15. Training and competence / التدريب والكفاءة

**EN:** Authorised operator must demonstrate correct academy and record selection, appropriate screen/action permission, execution of the four steps, stop conditions, evidence capture and escalation. Trainer, assessment, refresher schedule and sign-off: TBC.

**AR:** التدريب والكفاءة: يجب أن يثبت المنفذ قدرته على التحقق من السجل والصلاحيات واتباع خطوات الإجراء واكتشاف حالات التوقف وتوثيق الاستثناءات والتسليم. معايير التقييم واعتماد الكفاءة غير محددة.


#### 16. Source trace and change log / المصادر وسجل التغيير

**EN:** RPH-CMS-KB-001 rev 1.0 §§4, 20, 21, 22, 23, 25, 26; catalogue §25; decision register §26; evidence §28; SOP template §29. Linked decisions: DEC-19, DEC-20, DEC-21, DEC-22, DEC-25 (applicability and policy values to be confirmed). Revision 0.1 dated 20 Nov 2026, AI-assisted initial draft, no human approval.

**AR:** المصدر والإصدار: راجع الأقسام المشار إليها في قاعدة المعرفة RPH-CMS-KB-001 وسجل القرارات غير المحسومة وسجل التعديلات. لا يصبح الإجراء نافذاً قبل استكمال مراجعة أصحاب الصلاحية واعتماده.

**Revision:** 1.0.2 — Arabic language and bilingual layout improvements; human approval pending.


### SYS-002 — Maintain academy/stable scope and link existing users safely

**العنوان العربي:** إدارة نطاق الأكاديمية وربط المستخدمين القائمين بأمان

**v1.0.2 | DRAFT — NOT APPROVED FOR OPERATIONAL USE**


#### 1. Control header / بيانات ضبط الإجراء

**EN:** ID: SYS-002 | Version: 1.0.2 | Status: DRAFT — NOT APPROVED FOR OPERATIONAL USE | Priority: P1 | Proposed owner: System admin | Proposed approver: designated accountable manager/specialist (TBC) | Effective/review dates: TBC | Related SOPs: SYS-001, SYS-003, SYS-004, SYS-005, SYS-006.

**AR:** البيانات الأساسية: رقم الإجراء وإصداره وحالته ومسؤوليته وأولوية تنفيذه والموافقات المطلوبة وتاريخ النفاذ والمراجعة. جميع المسؤوليات المقترحة تحتاج اعتماد الإدارة، ولا يوجد اعتماد تشغيلي لهذه النسخة.


#### 2. Purpose / الغرض

**EN:** Ensure controlled, traceable execution of: maintain academy/stable scope and link existing users safely, with correct academy/customer/horse references, documented exceptions and authorised follow-up.

**AR:** الغرض من هذا الإجراء هو «إدارة نطاق الأكاديمية وربط المستخدمين القائمين بأمان» على نحوٍ موثق وقابل للمراجعة، مع التصعيد عند وجود استثناء.


#### 3. Scope and exclusions / النطاق والاستثناءات

**EN:** System administration workflow in the authenticated management web portal and, only where implemented, member web/native iOS. Authoring and privileged configuration are web/restricted-operator tasks unless explicitly supported in the app. No public marketing website, unapproved physical service, clinical prescription, legal decision, bank transaction or software change is authorised by this draft.

**AR:** ينطبق على العملية «إدارة نطاق الأكاديمية وربط المستخدمين القائمين بأمان» ضمن صلاحيات النظام المعتمدة، ولا يشمل تنفيذ أعمال خارج نطاق التفويض.


#### 4. Trigger and frequency / متى يبدأ وتكراره

**EN:** Start when the described operation is requested, a relevant record changes or an exception is discovered. Routine review frequency and response targets: TBC — MANAGEMENT APPROVAL REQUIRED.

**AR:** يُنفذ عند الحاجة إلى «إدارة نطاق الأكاديمية وربط المستخدمين القائمين بأمان»، أما التكرار ومواعيد المتابعة فتحتاج إلى اعتماد إدارة النادي.


#### 5. Responsible roles / الأدوار والمسؤوليات

**EN:** Proposed operator: System admin; verifier: relevant supervisor or independent reviewer; approver: designated management/finance/veterinary/technical authority as applicable; escalation deputy: TBC. These are proposed functions, not confirmed appointments. Separate business approval from software grants.

**AR:** الأدوار: المنفذ هو المسؤول المقترح في فهرس الإجراءات؛ ويقوم المشرف أو المراجع المستقل بالتحقق، وتعتمد الجهة المختصة القرار عند الحاجة. يُفصل بين صلاحية النظام والموافقة الإدارية أو المهنية.


#### 6. Prerequisites / المتطلبات المسبقة

**EN:** Verify personal sign-in, selected academy, correct source record and ID, permitted action, up-to-date application state, and any approved policy, evidence, physical resource or external receipt required. Applicable access: System administrator or restricted technical/deployment operator; separate authorities.

**AR:** المتطلبات المسبقة: تحقق من الحساب الشخصي والأكاديمية المختارة ومعرف السجل والصلاحية وصحة البيانات الحالية. لا تُنفذ العملية دون مستند أو موافقة أو مورد أو إثبات مالي خارجي عندما يكون مطلوباً.


#### 7. Inputs and evidence / المدخلات والأدلة

**EN:** Retain relevant user/horse/class/booking/plan/inventory/stay IDs, Riyadh-local date and original timestamp, source approval, supporting documents, before/after values and reference numbers. Do not record passwords, SMTP secrets or full card data.

**AR:** المدخلات والأدلة: سجل المعرفات المرجعية والتاريخ والتوقيت المحلي للرياض والمرجع الأصلي والموافقة والمرفقات والقيم قبل التعديل وبعده. لا تُدوّن كلمات المرور أو مفاتيح الخدمات أو بيانات البطاقات الحساسة.


#### 8. Procedure / خطوات التنفيذ

**EN:** Numbered operational steps; use exact currently deployed screen labels where they differ from the working terms below.

**AR:** خطوات التنفيذ: اتبع الخطوات الإنجليزية المرقمة الموازية بالترتيب، وتحقق بعد كل خطوة من النتيجة في السجل الأساسي. إذا لم تتطابق النتيجة، أوقف التكرار غير المدروس وارفع الاستثناء.

**EN:** 8.1. Verify intended academy and user account identity. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع الحساب ضمن إجراء «إدارة نطاق الأكاديمية وربط المستخدمين القائمين بأمان»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.2. Review membership links and system administrator continuity. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع البيانات ذات الصلة ضمن إجراء «إدارة نطاق الأكاديمية وربط المستخدمين القائمين بأمان»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.3. Link existing account safely without cross-academy disclosure. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** اربط الحساب القائم والحساب ضمن إجراء «إدارة نطاق الأكاديمية وربط المستخدمين القائمين بأمان»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Verify record scope and resulting permissions. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع الصلاحية والسجل ضمن إجراء «إدارة نطاق الأكاديمية وربط المستخدمين القائمين بأمان»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant System administration workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: Server validation prevails; deployment and backup operations need separate approval; never reset production. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified system administration record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.

**AR:** المخرجات والتسليم: تحقق من حالة السجل والوقت والمنفذ والمعرفات والأرصدة أو المخزون أو السعة المرتبطة. عين مسؤول متابعة واضحاً لأي استثناء وأكمل التسليم المادي أو المالي بشكل منفصل عند الحاجة.


#### 12. Records, privacy and retention / السجلات والخصوصية والاحتفاظ

**EN:** [Verify source]

**AR:** السجلات والخصوصية والاحتفاظ: احتفظ بالمراجع والأدلة في الموقع المعتمد، وحدد صلاحية الاطلاع حسب العضو والأكاديمية. مدد الحفظ والإتلاف وموقع الأرشيف تحتاج موافقة الإدارة.


#### 13. Monitoring and sign-off / المتابعة والتوقيع

**EN:** Proposed verifier checks identity/academy, source evidence, server result, linked balance/stock/capacity effects, exception closure and communication. Track unresolved cases and duplicates; metric denominator, frequency, target and reviewer: TBC.

**AR:** المتابعة والتوقيع: يراجع المخول الهوية والأدلة والنتيجة والتأثيرات المرتبطة وسلامة التصحيح وتسوية الاستثناءات. المؤشرات والأهداف ودورية المتابعة تحتاج إلى موافقة الإدارة.


#### 14. Safety, legal and professional boundaries / حدود السلامة والقانون والمهنة

**EN:** Server validation prevails; deployment and backup operations need separate approval; never reset production. Application permission is not clinical, safety, financial or legal authority. Any operational policy not evidenced in the KB requires human approval; do not infer thresholds, tax compliance, prescriptions, tariffs, contractual rights or physical readiness.

**AR:** حدود السلامة والقانون والمهنة: صلاحية استخدام النظام ليست اعتماداً طبياً أو بيطرياً أو مالياً أو قانونياً. لا تُستنتج حدود السلامة أو الجرعات أو الأسعار أو المتطلبات التنظيمية من بيانات تجريبية أو من واجهات النظام.


#### 15. Training and competence / التدريب والكفاءة

**EN:** Authorised operator must demonstrate correct academy and record selection, appropriate screen/action permission, execution of the four steps, stop conditions, evidence capture and escalation. Trainer, assessment, refresher schedule and sign-off: TBC.

**AR:** التدريب والكفاءة: يجب أن يثبت المنفذ قدرته على التحقق من السجل والصلاحيات واتباع خطوات الإجراء واكتشاف حالات التوقف وتوثيق الاستثناءات والتسليم. معايير التقييم واعتماد الكفاءة غير محددة.


#### 16. Source trace and change log / المصادر وسجل التغيير

**EN:** RPH-CMS-KB-001 rev 1.0 §§4, 20, 21, 22, 23, 25, 26; catalogue §25; decision register §26; evidence §28; SOP template §29. Linked decisions: DEC-19, DEC-20, DEC-21, DEC-22, DEC-25 (applicability and policy values to be confirmed). Revision 0.1 dated 20 Nov 2026, AI-assisted initial draft, no human approval.

**AR:** المصدر والإصدار: راجع الأقسام المشار إليها في قاعدة المعرفة RPH-CMS-KB-001 وسجل القرارات غير المحسومة وسجل التعديلات. لا يصبح الإجراء نافذاً قبل استكمال مراجعة أصحاب الصلاحية واعتماده.

**Revision:** 1.0.2 — Arabic language and bilingual layout improvements; human approval pending.


### SYS-003 — Diagnose stale data, wrong-account display and access incidents

**العنوان العربي:** تشخيص البيانات غير المحدثة وعرض الحساب الخاطئ وحوادث صلاحيات الوصول

**v1.0.2 | DRAFT — NOT APPROVED FOR OPERATIONAL USE**


#### 1. Control header / بيانات ضبط الإجراء

**EN:** ID: SYS-003 | Version: 1.0.2 | Status: DRAFT — NOT APPROVED FOR OPERATIONAL USE | Priority: P1 | Proposed owner: IT/system owner | Proposed approver: designated accountable manager/specialist (TBC) | Effective/review dates: TBC | Related SOPs: SYS-001, SYS-002, SYS-004, SYS-005, SYS-006.

**AR:** البيانات الأساسية: رقم الإجراء وإصداره وحالته ومسؤوليته وأولوية تنفيذه والموافقات المطلوبة وتاريخ النفاذ والمراجعة. جميع المسؤوليات المقترحة تحتاج اعتماد الإدارة، ولا يوجد اعتماد تشغيلي لهذه النسخة.


#### 2. Purpose / الغرض

**EN:** Ensure controlled, traceable execution of: diagnose stale data, wrong-account display and access incidents, with correct academy/customer/horse references, documented exceptions and authorised follow-up.

**AR:** الغرض من هذا الإجراء هو «تشخيص البيانات غير المحدثة وعرض الحساب الخاطئ وحوادث صلاحيات الوصول» على نحوٍ موثق وقابل للمراجعة، مع التصعيد عند وجود استثناء.


#### 3. Scope and exclusions / النطاق والاستثناءات

**EN:** System administration workflow in the authenticated management web portal and, only where implemented, member web/native iOS. Authoring and privileged configuration are web/restricted-operator tasks unless explicitly supported in the app. No public marketing website, unapproved physical service, clinical prescription, legal decision, bank transaction or software change is authorised by this draft.

**AR:** ينطبق على العملية «تشخيص البيانات غير المحدثة وعرض الحساب الخاطئ وحوادث صلاحيات الوصول» ضمن صلاحيات النظام المعتمدة، ولا يشمل تنفيذ أعمال خارج نطاق التفويض.


#### 4. Trigger and frequency / متى يبدأ وتكراره

**EN:** Start when the described operation is requested, a relevant record changes or an exception is discovered. Routine review frequency and response targets: TBC — MANAGEMENT APPROVAL REQUIRED.

**AR:** يُنفذ عند الحاجة إلى «تشخيص البيانات غير المحدثة وعرض الحساب الخاطئ وحوادث صلاحيات الوصول»، أما التكرار ومواعيد المتابعة فتحتاج إلى اعتماد إدارة النادي.


#### 5. Responsible roles / الأدوار والمسؤوليات

**EN:** Proposed operator: IT/system owner; verifier: relevant supervisor or independent reviewer; approver: designated management/finance/veterinary/technical authority as applicable; escalation deputy: TBC. These are proposed functions, not confirmed appointments. Separate business approval from software grants.

**AR:** الأدوار: المنفذ هو المسؤول المقترح في فهرس الإجراءات؛ ويقوم المشرف أو المراجع المستقل بالتحقق، وتعتمد الجهة المختصة القرار عند الحاجة. يُفصل بين صلاحية النظام والموافقة الإدارية أو المهنية.


#### 6. Prerequisites / المتطلبات المسبقة

**EN:** Verify personal sign-in, selected academy, correct source record and ID, permitted action, up-to-date application state, and any approved policy, evidence, physical resource or external receipt required. Applicable access: System administrator or restricted technical/deployment operator; separate authorities.

**AR:** المتطلبات المسبقة: تحقق من الحساب الشخصي والأكاديمية المختارة ومعرف السجل والصلاحية وصحة البيانات الحالية. لا تُنفذ العملية دون مستند أو موافقة أو مورد أو إثبات مالي خارجي عندما يكون مطلوباً.


#### 7. Inputs and evidence / المدخلات والأدلة

**EN:** Retain relevant user/horse/class/booking/plan/inventory/stay IDs, Riyadh-local date and original timestamp, source approval, supporting documents, before/after values and reference numbers. Do not record passwords, SMTP secrets or full card data.

**AR:** المدخلات والأدلة: سجل المعرفات المرجعية والتاريخ والتوقيت المحلي للرياض والمرجع الأصلي والموافقة والمرفقات والقيم قبل التعديل وبعده. لا تُدوّن كلمات المرور أو مفاتيح الخدمات أو بيانات البطاقات الحساسة.


#### 8. Procedure / خطوات التنفيذ

**EN:** Numbered operational steps; use exact currently deployed screen labels where they differ from the working terms below.

**AR:** خطوات التنفيذ: اتبع الخطوات الإنجليزية المرقمة الموازية بالترتيب، وتحقق بعد كل خطوة من النتيجة في السجل الأساسي. إذا لم تتطابق النتيجة، أوقف التكرار غير المدروس وارفع الاستثناء.

**EN:** 8.1. Stop sensitive actions on wrong-account or inconsistent data. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** تحقق من الحساب ضمن إجراء «تشخيص البيانات غير المحدثة وعرض الحساب الخاطئ وحوادث صلاحيات الوصول»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.2. Compare login academy frontend backend and native versions. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع البيانات ذات الصلة ضمن إجراء «تشخيص البيانات غير المحدثة وعرض الحساب الخاطئ وحوادث صلاحيات الوصول»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.3. Refresh and inspect session/caching/origin validation evidence. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع الحصة ضمن إجراء «تشخيص البيانات غير المحدثة وعرض الحساب الخاطئ وحوادث صلاحيات الوصول»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Escalate technical repair without disabling access controls. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** حدّث البيانات ذات الصلة ضمن إجراء «تشخيص البيانات غير المحدثة وعرض الحساب الخاطئ وحوادث صلاحيات الوصول»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant System administration workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: Server validation prevails; deployment and backup operations need separate approval; never reset production. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified system administration record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.

**AR:** المخرجات والتسليم: تحقق من حالة السجل والوقت والمنفذ والمعرفات والأرصدة أو المخزون أو السعة المرتبطة. عين مسؤول متابعة واضحاً لأي استثناء وأكمل التسليم المادي أو المالي بشكل منفصل عند الحاجة.


#### 12. Records, privacy and retention / السجلات والخصوصية والاحتفاظ

**EN:** [Verify source]

**AR:** السجلات والخصوصية والاحتفاظ: احتفظ بالمراجع والأدلة في الموقع المعتمد، وحدد صلاحية الاطلاع حسب العضو والأكاديمية. مدد الحفظ والإتلاف وموقع الأرشيف تحتاج موافقة الإدارة.


#### 13. Monitoring and sign-off / المتابعة والتوقيع

**EN:** Proposed verifier checks identity/academy, source evidence, server result, linked balance/stock/capacity effects, exception closure and communication. Track unresolved cases and duplicates; metric denominator, frequency, target and reviewer: TBC.

**AR:** المتابعة والتوقيع: يراجع المخول الهوية والأدلة والنتيجة والتأثيرات المرتبطة وسلامة التصحيح وتسوية الاستثناءات. المؤشرات والأهداف ودورية المتابعة تحتاج إلى موافقة الإدارة.


#### 14. Safety, legal and professional boundaries / حدود السلامة والقانون والمهنة

**EN:** Server validation prevails; deployment and backup operations need separate approval; never reset production. Application permission is not clinical, safety, financial or legal authority. Any operational policy not evidenced in the KB requires human approval; do not infer thresholds, tax compliance, prescriptions, tariffs, contractual rights or physical readiness.

**AR:** حدود السلامة والقانون والمهنة: صلاحية استخدام النظام ليست اعتماداً طبياً أو بيطرياً أو مالياً أو قانونياً. لا تُستنتج حدود السلامة أو الجرعات أو الأسعار أو المتطلبات التنظيمية من بيانات تجريبية أو من واجهات النظام.


#### 15. Training and competence / التدريب والكفاءة

**EN:** Authorised operator must demonstrate correct academy and record selection, appropriate screen/action permission, execution of the four steps, stop conditions, evidence capture and escalation. Trainer, assessment, refresher schedule and sign-off: TBC.

**AR:** التدريب والكفاءة: يجب أن يثبت المنفذ قدرته على التحقق من السجل والصلاحيات واتباع خطوات الإجراء واكتشاف حالات التوقف وتوثيق الاستثناءات والتسليم. معايير التقييم واعتماد الكفاءة غير محددة.


#### 16. Source trace and change log / المصادر وسجل التغيير

**EN:** RPH-CMS-KB-001 rev 1.0 §§4, 20, 21, 22, 23, 25, 26; catalogue §25; decision register §26; evidence §28; SOP template §29. Linked decisions: DEC-19, DEC-20, DEC-21, DEC-22, DEC-25 (applicability and policy values to be confirmed). Revision 0.1 dated 20 Nov 2026, AI-assisted initial draft, no human approval.

**AR:** المصدر والإصدار: راجع الأقسام المشار إليها في قاعدة المعرفة RPH-CMS-KB-001 وسجل القرارات غير المحسومة وسجل التعديلات. لا يصبح الإجراء نافذاً قبل استكمال مراجعة أصحاب الصلاحية واعتماده.

**Revision:** 1.0.2 — Arabic language and bilingual layout improvements; human approval pending.


### SYS-004 — Back up database, required keys and protected records

**العنوان العربي:** نسخ قاعدة البيانات والمفاتيح والسجلات المحمية احتياطياً

**v1.0.2 | DRAFT — NOT APPROVED FOR OPERATIONAL USE**


#### 1. Control header / بيانات ضبط الإجراء

**EN:** ID: SYS-004 | Version: 1.0.2 | Status: DRAFT — NOT APPROVED FOR OPERATIONAL USE | Priority: P1 | Proposed owner: Technical operator | Proposed approver: designated accountable manager/specialist (TBC) | Effective/review dates: TBC | Related SOPs: SYS-001, SYS-002, SYS-003, SYS-005, SYS-006.

**AR:** البيانات الأساسية: رقم الإجراء وإصداره وحالته ومسؤوليته وأولوية تنفيذه والموافقات المطلوبة وتاريخ النفاذ والمراجعة. جميع المسؤوليات المقترحة تحتاج اعتماد الإدارة، ولا يوجد اعتماد تشغيلي لهذه النسخة.


#### 2. Purpose / الغرض

**EN:** Ensure controlled, traceable execution of: back up database, required keys and protected records, with correct academy/customer/horse references, documented exceptions and authorised follow-up.

**AR:** الغرض من هذا الإجراء هو «نسخ قاعدة البيانات والمفاتيح والسجلات المحمية احتياطياً» على نحوٍ موثق وقابل للمراجعة، مع التصعيد عند وجود استثناء.


#### 3. Scope and exclusions / النطاق والاستثناءات

**EN:** System administration workflow in the authenticated management web portal and, only where implemented, member web/native iOS. Authoring and privileged configuration are web/restricted-operator tasks unless explicitly supported in the app. No public marketing website, unapproved physical service, clinical prescription, legal decision, bank transaction or software change is authorised by this draft.

**AR:** ينطبق على العملية «نسخ قاعدة البيانات والمفاتيح والسجلات المحمية احتياطياً» ضمن صلاحيات النظام المعتمدة، ولا يشمل تنفيذ أعمال خارج نطاق التفويض.


#### 4. Trigger and frequency / متى يبدأ وتكراره

**EN:** Start when the described operation is requested, a relevant record changes or an exception is discovered. Routine review frequency and response targets: TBC — MANAGEMENT APPROVAL REQUIRED.

**AR:** يُنفذ عند الحاجة إلى «نسخ قاعدة البيانات والمفاتيح والسجلات المحمية احتياطياً»، أما التكرار ومواعيد المتابعة فتحتاج إلى اعتماد إدارة النادي.


#### 5. Responsible roles / الأدوار والمسؤوليات

**EN:** Proposed operator: Technical operator; verifier: relevant supervisor or independent reviewer; approver: designated management/finance/veterinary/technical authority as applicable; escalation deputy: TBC. These are proposed functions, not confirmed appointments. Separate business approval from software grants.

**AR:** الأدوار: المنفذ هو المسؤول المقترح في فهرس الإجراءات؛ ويقوم المشرف أو المراجع المستقل بالتحقق، وتعتمد الجهة المختصة القرار عند الحاجة. يُفصل بين صلاحية النظام والموافقة الإدارية أو المهنية.


#### 6. Prerequisites / المتطلبات المسبقة

**EN:** Verify personal sign-in, selected academy, correct source record and ID, permitted action, up-to-date application state, and any approved policy, evidence, physical resource or external receipt required. Applicable access: System administrator or restricted technical/deployment operator; separate authorities.

**AR:** المتطلبات المسبقة: تحقق من الحساب الشخصي والأكاديمية المختارة ومعرف السجل والصلاحية وصحة البيانات الحالية. لا تُنفذ العملية دون مستند أو موافقة أو مورد أو إثبات مالي خارجي عندما يكون مطلوباً.


#### 7. Inputs and evidence / المدخلات والأدلة

**EN:** Retain relevant user/horse/class/booking/plan/inventory/stay IDs, Riyadh-local date and original timestamp, source approval, supporting documents, before/after values and reference numbers. Do not record passwords, SMTP secrets or full card data.

**AR:** المدخلات والأدلة: سجل المعرفات المرجعية والتاريخ والتوقيت المحلي للرياض والمرجع الأصلي والموافقة والمرفقات والقيم قبل التعديل وبعده. لا تُدوّن كلمات المرور أو مفاتيح الخدمات أو بيانات البطاقات الحساسة.


#### 8. Procedure / خطوات التنفيذ

**EN:** Numbered operational steps; use exact currently deployed screen labels where they differ from the working terms below.

**AR:** خطوات التنفيذ: اتبع الخطوات الإنجليزية المرقمة الموازية بالترتيب، وتحقق بعد كل خطوة من النتيجة في السجل الأساسي. إذا لم تتطابق النتيجة، أوقف التكرار غير المدروس وارفع الاستثناء.

**EN:** 8.1. Obtain restricted IT approval and identify exact persistent SQLite database path. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** تحقق من الموافقة ضمن إجراء «نسخ قاعدة البيانات والمفاتيح والسجلات المحمية احتياطياً»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.2. Create consistent database backup with required protected keys and media. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** أنشئ النسخة الاحتياطية ضمن إجراء «نسخ قاعدة البيانات والمفاتيح والسجلات المحمية احتياطياً»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.3. Verify backup integrity access encryption and metadata. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع النسخة الاحتياطية ضمن إجراء «نسخ قاعدة البيانات والمفاتيح والسجلات المحمية احتياطياً»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Store securely under approved schedule without copying active DB casually. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** تحقق من البيانات ذات الصلة ضمن إجراء «نسخ قاعدة البيانات والمفاتيح والسجلات المحمية احتياطياً»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant System administration workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: Backups must be SQLite-consistent and preserve matching SMTP encryption key and protected assets. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified system administration record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.

**AR:** المخرجات والتسليم: تحقق من حالة السجل والوقت والمنفذ والمعرفات والأرصدة أو المخزون أو السعة المرتبطة. عين مسؤول متابعة واضحاً لأي استثناء وأكمل التسليم المادي أو المالي بشكل منفصل عند الحاجة.


#### 12. Records, privacy and retention / السجلات والخصوصية والاحتفاظ

**EN:** [Verify source]

**AR:** السجلات والخصوصية والاحتفاظ: احتفظ بالمراجع والأدلة في الموقع المعتمد، وحدد صلاحية الاطلاع حسب العضو والأكاديمية. مدد الحفظ والإتلاف وموقع الأرشيف تحتاج موافقة الإدارة.


#### 13. Monitoring and sign-off / المتابعة والتوقيع

**EN:** Proposed verifier checks identity/academy, source evidence, server result, linked balance/stock/capacity effects, exception closure and communication. Track unresolved cases and duplicates; metric denominator, frequency, target and reviewer: TBC.

**AR:** المتابعة والتوقيع: يراجع المخول الهوية والأدلة والنتيجة والتأثيرات المرتبطة وسلامة التصحيح وتسوية الاستثناءات. المؤشرات والأهداف ودورية المتابعة تحتاج إلى موافقة الإدارة.


#### 14. Safety, legal and professional boundaries / حدود السلامة والقانون والمهنة

**EN:** Server validation prevails; deployment and backup operations need separate approval; never reset production. Application permission is not clinical, safety, financial or legal authority. Any operational policy not evidenced in the KB requires human approval; do not infer thresholds, tax compliance, prescriptions, tariffs, contractual rights or physical readiness.

**AR:** حدود السلامة والقانون والمهنة: صلاحية استخدام النظام ليست اعتماداً طبياً أو بيطرياً أو مالياً أو قانونياً. لا تُستنتج حدود السلامة أو الجرعات أو الأسعار أو المتطلبات التنظيمية من بيانات تجريبية أو من واجهات النظام.


#### 15. Training and competence / التدريب والكفاءة

**EN:** Authorised operator must demonstrate correct academy and record selection, appropriate screen/action permission, execution of the four steps, stop conditions, evidence capture and escalation. Trainer, assessment, refresher schedule and sign-off: TBC.

**AR:** التدريب والكفاءة: يجب أن يثبت المنفذ قدرته على التحقق من السجل والصلاحيات واتباع خطوات الإجراء واكتشاف حالات التوقف وتوثيق الاستثناءات والتسليم. معايير التقييم واعتماد الكفاءة غير محددة.


#### 16. Source trace and change log / المصادر وسجل التغيير

**EN:** RPH-CMS-KB-001 rev 1.0 §§4, 20, 21, 22, 23, 25, 26; catalogue §25; decision register §26; evidence §28; SOP template §29. Linked decisions: DEC-19, DEC-20, DEC-21, DEC-22, DEC-25 (applicability and policy values to be confirmed). Revision 0.1 dated 20 Nov 2026, AI-assisted initial draft, no human approval.

**AR:** المصدر والإصدار: راجع الأقسام المشار إليها في قاعدة المعرفة RPH-CMS-KB-001 وسجل القرارات غير المحسومة وسجل التعديلات. لا يصبح الإجراء نافذاً قبل استكمال مراجعة أصحاب الصلاحية واعتماده.

**Revision:** 1.0.2 — Arabic language and bilingual layout improvements; human approval pending.


### SYS-005 — Restore/test recovery and reconstruct any later activity

**العنوان العربي:** اختبار استعادة النسخ الاحتياطية وإعادة بناء العمليات اللاحقة

**v1.0.2 | DRAFT — NOT APPROVED FOR OPERATIONAL USE**


#### 1. Control header / بيانات ضبط الإجراء

**EN:** ID: SYS-005 | Version: 1.0.2 | Status: DRAFT — NOT APPROVED FOR OPERATIONAL USE | Priority: P1 | Proposed owner: Technical operator/approver | Proposed approver: designated accountable manager/specialist (TBC) | Effective/review dates: TBC | Related SOPs: SYS-001, SYS-002, SYS-003, SYS-004, SYS-006.

**AR:** البيانات الأساسية: رقم الإجراء وإصداره وحالته ومسؤوليته وأولوية تنفيذه والموافقات المطلوبة وتاريخ النفاذ والمراجعة. جميع المسؤوليات المقترحة تحتاج اعتماد الإدارة، ولا يوجد اعتماد تشغيلي لهذه النسخة.


#### 2. Purpose / الغرض

**EN:** Ensure controlled, traceable execution of: restore/test recovery and reconstruct any later activity, with correct academy/customer/horse references, documented exceptions and authorised follow-up.

**AR:** الغرض من هذا الإجراء هو «اختبار استعادة النسخ الاحتياطية وإعادة بناء العمليات اللاحقة» على نحوٍ موثق وقابل للمراجعة، مع التصعيد عند وجود استثناء.


#### 3. Scope and exclusions / النطاق والاستثناءات

**EN:** System administration workflow in the authenticated management web portal and, only where implemented, member web/native iOS. Authoring and privileged configuration are web/restricted-operator tasks unless explicitly supported in the app. No public marketing website, unapproved physical service, clinical prescription, legal decision, bank transaction or software change is authorised by this draft.

**AR:** ينطبق على العملية «اختبار استعادة النسخ الاحتياطية وإعادة بناء العمليات اللاحقة» ضمن صلاحيات النظام المعتمدة، ولا يشمل تنفيذ أعمال خارج نطاق التفويض.


#### 4. Trigger and frequency / متى يبدأ وتكراره

**EN:** Start when the described operation is requested, a relevant record changes or an exception is discovered. Routine review frequency and response targets: TBC — MANAGEMENT APPROVAL REQUIRED.

**AR:** يُنفذ عند الحاجة إلى «اختبار استعادة النسخ الاحتياطية وإعادة بناء العمليات اللاحقة»، أما التكرار ومواعيد المتابعة فتحتاج إلى اعتماد إدارة النادي.


#### 5. Responsible roles / الأدوار والمسؤوليات

**EN:** Proposed operator: Technical operator/approver; verifier: relevant supervisor or independent reviewer; approver: designated management/finance/veterinary/technical authority as applicable; escalation deputy: TBC. These are proposed functions, not confirmed appointments. Separate business approval from software grants.

**AR:** الأدوار: المنفذ هو المسؤول المقترح في فهرس الإجراءات؛ ويقوم المشرف أو المراجع المستقل بالتحقق، وتعتمد الجهة المختصة القرار عند الحاجة. يُفصل بين صلاحية النظام والموافقة الإدارية أو المهنية.


#### 6. Prerequisites / المتطلبات المسبقة

**EN:** Verify personal sign-in, selected academy, correct source record and ID, permitted action, up-to-date application state, and any approved policy, evidence, physical resource or external receipt required. Applicable access: System administrator or restricted technical/deployment operator; separate authorities.

**AR:** المتطلبات المسبقة: تحقق من الحساب الشخصي والأكاديمية المختارة ومعرف السجل والصلاحية وصحة البيانات الحالية. لا تُنفذ العملية دون مستند أو موافقة أو مورد أو إثبات مالي خارجي عندما يكون مطلوباً.


#### 7. Inputs and evidence / المدخلات والأدلة

**EN:** Retain relevant user/horse/class/booking/plan/inventory/stay IDs, Riyadh-local date and original timestamp, source approval, supporting documents, before/after values and reference numbers. Do not record passwords, SMTP secrets or full card data.

**AR:** المدخلات والأدلة: سجل المعرفات المرجعية والتاريخ والتوقيت المحلي للرياض والمرجع الأصلي والموافقة والمرفقات والقيم قبل التعديل وبعده. لا تُدوّن كلمات المرور أو مفاتيح الخدمات أو بيانات البطاقات الحساسة.


#### 8. Procedure / خطوات التنفيذ

**EN:** Numbered operational steps; use exact currently deployed screen labels where they differ from the working terms below.

**AR:** خطوات التنفيذ: اتبع الخطوات الإنجليزية المرقمة الموازية بالترتيب، وتحقق بعد كل خطوة من النتيجة في السجل الأساسي. إذا لم تتطابق النتيجة، أوقف التكرار غير المدروس وارفع الاستثناء.

**EN:** 8.1. Obtain recovery approval and identify known-good consistent backup. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** تحقق من النسخة الاحتياطية والموافقة ضمن إجراء «اختبار استعادة النسخ الاحتياطية وإعادة بناء العمليات اللاحقة»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.2. Test restore in isolated environment with matching encryption keys. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** اختبر الاستعادة ضمن إجراء «اختبار استعادة النسخ الاحتياطية وإعادة بناء العمليات اللاحقة»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.3. Verify accounts balances bookings boarding and protected documents. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع الحجز والإيواء والمستند ضمن إجراء «اختبار استعادة النسخ الاحتياطية وإعادة بناء العمليات اللاحقة»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Record recovery point and transactions needing reconstruction before any live restore. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** دوّن الاستعادة والسجل ضمن إجراء «اختبار استعادة النسخ الاحتياطية وإعادة بناء العمليات اللاحقة»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant System administration workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: Never overwrite live service with a restore without separate approved recovery process. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified system administration record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.

**AR:** المخرجات والتسليم: تحقق من حالة السجل والوقت والمنفذ والمعرفات والأرصدة أو المخزون أو السعة المرتبطة. عين مسؤول متابعة واضحاً لأي استثناء وأكمل التسليم المادي أو المالي بشكل منفصل عند الحاجة.


#### 12. Records, privacy and retention / السجلات والخصوصية والاحتفاظ

**EN:** [Verify source]

**AR:** السجلات والخصوصية والاحتفاظ: احتفظ بالمراجع والأدلة في الموقع المعتمد، وحدد صلاحية الاطلاع حسب العضو والأكاديمية. مدد الحفظ والإتلاف وموقع الأرشيف تحتاج موافقة الإدارة.


#### 13. Monitoring and sign-off / المتابعة والتوقيع

**EN:** Proposed verifier checks identity/academy, source evidence, server result, linked balance/stock/capacity effects, exception closure and communication. Track unresolved cases and duplicates; metric denominator, frequency, target and reviewer: TBC.

**AR:** المتابعة والتوقيع: يراجع المخول الهوية والأدلة والنتيجة والتأثيرات المرتبطة وسلامة التصحيح وتسوية الاستثناءات. المؤشرات والأهداف ودورية المتابعة تحتاج إلى موافقة الإدارة.


#### 14. Safety, legal and professional boundaries / حدود السلامة والقانون والمهنة

**EN:** Server validation prevails; deployment and backup operations need separate approval; never reset production. Application permission is not clinical, safety, financial or legal authority. Any operational policy not evidenced in the KB requires human approval; do not infer thresholds, tax compliance, prescriptions, tariffs, contractual rights or physical readiness.

**AR:** حدود السلامة والقانون والمهنة: صلاحية استخدام النظام ليست اعتماداً طبياً أو بيطرياً أو مالياً أو قانونياً. لا تُستنتج حدود السلامة أو الجرعات أو الأسعار أو المتطلبات التنظيمية من بيانات تجريبية أو من واجهات النظام.


#### 15. Training and competence / التدريب والكفاءة

**EN:** Authorised operator must demonstrate correct academy and record selection, appropriate screen/action permission, execution of the four steps, stop conditions, evidence capture and escalation. Trainer, assessment, refresher schedule and sign-off: TBC.

**AR:** التدريب والكفاءة: يجب أن يثبت المنفذ قدرته على التحقق من السجل والصلاحيات واتباع خطوات الإجراء واكتشاف حالات التوقف وتوثيق الاستثناءات والتسليم. معايير التقييم واعتماد الكفاءة غير محددة.


#### 16. Source trace and change log / المصادر وسجل التغيير

**EN:** RPH-CMS-KB-001 rev 1.0 §§4, 20, 21, 22, 23, 25, 26; catalogue §25; decision register §26; evidence §28; SOP template §29. Linked decisions: DEC-19, DEC-20, DEC-21, DEC-22, DEC-25 (applicability and policy values to be confirmed). Revision 0.1 dated 20 Nov 2026, AI-assisted initial draft, no human approval.

**AR:** المصدر والإصدار: راجع الأقسام المشار إليها في قاعدة المعرفة RPH-CMS-KB-001 وسجل القرارات غير المحسومة وسجل التعديلات. لا يصبح الإجراء نافذاً قبل استكمال مراجعة أصحاب الصلاحية واعتماده.

**Revision:** 1.0.2 — Arabic language and bilingual layout improvements; human approval pending.


### SYS-006 — Deploy compatible frontend/backend versions and verify health

**العنوان العربي:** نشر إصدارات متوافقة للواجهة والخادم والتحقق من سلامة التشغيل

**v1.0.2 | DRAFT — NOT APPROVED FOR OPERATIONAL USE**


#### 1. Control header / بيانات ضبط الإجراء

**EN:** ID: SYS-006 | Version: 1.0.2 | Status: DRAFT — NOT APPROVED FOR OPERATIONAL USE | Priority: P1 | Proposed owner: Technical operator | Proposed approver: designated accountable manager/specialist (TBC) | Effective/review dates: TBC | Related SOPs: SYS-001, SYS-002, SYS-003, SYS-004, SYS-005.

**AR:** البيانات الأساسية: رقم الإجراء وإصداره وحالته ومسؤوليته وأولوية تنفيذه والموافقات المطلوبة وتاريخ النفاذ والمراجعة. جميع المسؤوليات المقترحة تحتاج اعتماد الإدارة، ولا يوجد اعتماد تشغيلي لهذه النسخة.


#### 2. Purpose / الغرض

**EN:** Ensure controlled, traceable execution of: deploy compatible frontend/backend versions and verify health, with correct academy/customer/horse references, documented exceptions and authorised follow-up.

**AR:** الغرض من هذا الإجراء هو «نشر إصدارات متوافقة للواجهة والخادم والتحقق من سلامة التشغيل» على نحوٍ موثق وقابل للمراجعة، مع التصعيد عند وجود استثناء.


#### 3. Scope and exclusions / النطاق والاستثناءات

**EN:** System administration workflow in the authenticated management web portal and, only where implemented, member web/native iOS. Authoring and privileged configuration are web/restricted-operator tasks unless explicitly supported in the app. No public marketing website, unapproved physical service, clinical prescription, legal decision, bank transaction or software change is authorised by this draft.

**AR:** ينطبق على العملية «نشر إصدارات متوافقة للواجهة والخادم والتحقق من سلامة التشغيل» ضمن صلاحيات النظام المعتمدة، ولا يشمل تنفيذ أعمال خارج نطاق التفويض.


#### 4. Trigger and frequency / متى يبدأ وتكراره

**EN:** Start when the described operation is requested, a relevant record changes or an exception is discovered. Routine review frequency and response targets: TBC — MANAGEMENT APPROVAL REQUIRED.

**AR:** يُنفذ عند الحاجة إلى «نشر إصدارات متوافقة للواجهة والخادم والتحقق من سلامة التشغيل»، أما التكرار ومواعيد المتابعة فتحتاج إلى اعتماد إدارة النادي.


#### 5. Responsible roles / الأدوار والمسؤوليات

**EN:** Proposed operator: Technical operator; verifier: relevant supervisor or independent reviewer; approver: designated management/finance/veterinary/technical authority as applicable; escalation deputy: TBC. These are proposed functions, not confirmed appointments. Separate business approval from software grants.

**AR:** الأدوار: المنفذ هو المسؤول المقترح في فهرس الإجراءات؛ ويقوم المشرف أو المراجع المستقل بالتحقق، وتعتمد الجهة المختصة القرار عند الحاجة. يُفصل بين صلاحية النظام والموافقة الإدارية أو المهنية.


#### 6. Prerequisites / المتطلبات المسبقة

**EN:** Verify personal sign-in, selected academy, correct source record and ID, permitted action, up-to-date application state, and any approved policy, evidence, physical resource or external receipt required. Applicable access: System administrator or restricted technical/deployment operator; separate authorities.

**AR:** المتطلبات المسبقة: تحقق من الحساب الشخصي والأكاديمية المختارة ومعرف السجل والصلاحية وصحة البيانات الحالية. لا تُنفذ العملية دون مستند أو موافقة أو مورد أو إثبات مالي خارجي عندما يكون مطلوباً.


#### 7. Inputs and evidence / المدخلات والأدلة

**EN:** Retain relevant user/horse/class/booking/plan/inventory/stay IDs, Riyadh-local date and original timestamp, source approval, supporting documents, before/after values and reference numbers. Do not record passwords, SMTP secrets or full card data.

**AR:** المدخلات والأدلة: سجل المعرفات المرجعية والتاريخ والتوقيت المحلي للرياض والمرجع الأصلي والموافقة والمرفقات والقيم قبل التعديل وبعده. لا تُدوّن كلمات المرور أو مفاتيح الخدمات أو بيانات البطاقات الحساسة.


#### 8. Procedure / خطوات التنفيذ

**EN:** Numbered operational steps; use exact currently deployed screen labels where they differ from the working terms below.

**AR:** خطوات التنفيذ: اتبع الخطوات الإنجليزية المرقمة الموازية بالترتيب، وتحقق بعد كل خطوة من النتيجة في السجل الأساسي. إذا لم تتطابق النتيجة، أوقف التكرار غير المدروس وارفع الاستثناء.

**EN:** 8.1. Verify approved commits branches deployment plan and backup. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع النسخة الاحتياطية ضمن إجراء «نشر إصدارات متوافقة للواجهة والخادم ومراجعة سلامة التشغيل»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.2. Deploy compatible frontend/backend without demo reset or unapproved branch merge. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** اختبر البيانات ذات الصلة ضمن إجراء «نشر إصدارات متوافقة للواجهة والخادم ومراجعة سلامة التشغيل»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.3. Restart backend as authorised and verify health/version. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع البيانات ذات الصلة ضمن إجراء «نشر إصدارات متوافقة للواجهة والخادم ومراجعة سلامة التشغيل»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Test critical web and native contract workflows and rollback decision. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** اختبر البيانات ذات الصلة ضمن إجراء «نشر إصدارات متوافقة للواجهة والخادم ومراجعة سلامة التشغيل»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant System administration workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: Server validation prevails; deployment and backup operations need separate approval; never reset production. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified system administration record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.
